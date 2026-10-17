"""Sun Print hero: six-object cyanotype photogram at real scale.

Usage (from new_sveltekit/): python scripts/photogram/render.py
Needs numpy, opencv-python and Pillow (with AVIF). Writes the hero images, OG
image and icons into static/, and object hit areas into src/lib/print/.

Everything is in millimetres on the paper; PX_PER_MM maps to pixels. 3D objects
are stacks of height slices projected along the sun with blur growing with
height (sun drift); flat objects are near-contact prints. Grain is sampled from
Anna Atkins plate 078 (Met Open Access, public domain).
"""
import json
import math
import os
import sys

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shapes import bezier_path, catmull, controller_outline, ellipse, hex_bgr, rounded_rect  # noqa: E402

PX_PER_MM = 4.0
SUN = np.array([0.20, 0.16])
DRIFT = 0.05


class Paper:
    def __init__(self, w, h, seed):
        self.W, self.H = w, h
        self.rng = np.random.default_rng(seed)

    def noise(self, sx, sy=None, amp=1.0, angle=0.0):
        n = self.rng.standard_normal((self.H, self.W)).astype(np.float32)
        n = cv2.GaussianBlur(n, (0, 0), sigmaX=sx, sigmaY=sy or sx)
        if angle:
            M = cv2.getRotationMatrix2D((self.W / 2, self.H / 2), angle, 1.0)
            n = cv2.warpAffine(n, M, (self.W, self.H), borderMode=cv2.BORDER_REFLECT)
        return n / (n.std() + 1e-6) * amp

    def zeros(self):
        return np.zeros((self.H, self.W), np.float32)

    def poly(self, pts):
        m = self.zeros()
        cv2.fillPoly(m, [np.round(pts * 4).astype(np.int32)], 1.0, cv2.LINE_AA, 2)
        return m

    def line(self, pts, width_px):
        m = self.zeros()
        cv2.polylines(m, [np.round(pts * 4).astype(np.int32)], False, 1.0, max(1, int(width_px)), cv2.LINE_AA, 2)
        return m

    def project(self, mask, h_mm, base_blur=0.8):
        dx, dy = SUN * h_mm * PX_PER_MM
        shifted = cv2.warpAffine(mask, np.float32([[1, 0, dx], [0, 1, dy]]), (self.W, self.H), borderValue=0)
        return cv2.GaussianBlur(shifted, (0, 0), base_blur + DRIFT * h_mm * PX_PER_MM)


def placer(cx, cy, deg):
    """mm-local points -> pixel coords, centred at (cx, cy) px, rotated deg."""
    a = math.radians(deg)
    R = np.array([[math.cos(a), -math.sin(a)], [math.sin(a), math.cos(a)]])
    return lambda pts: (np.asarray(pts, float) * PX_PER_MM) @ R.T + np.array([cx, cy])


def k(r):
    r = max(1, int(r))
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (r, r))


# ----------------------------------------------------------------- objects

def stencil(p, cx, cy, deg, curl_corner=(1, 1)):
    T = placer(cx, cy, deg)
    s = 0.18  # template drawn in 1000-unit space -> 180 mm wide
    plate_pts = rounded_rect(1000, 520, 36) * s
    plate = p.poly(T(plate_pts))
    holes = p.zeros()
    shapes = [
        (rounded_rect(150, 84, 4), -360, -110), (rounded_rect(160, 70, 34), -170, -115),
        (np.array([(0, -62), (92, 0), (0, 62), (-92, 0)]), 20, -110),
        (np.array([(-62, -40), (88, -40), (62, 40), (-88, 40)]), 215, -112),
        (ellipse(40, 40), 370, -112),
        (bezier_path((-75, -40), [((-25, -40), (25, -40), (75, -40)), ((75, -5), (75, 10), (75, 34)),
                                   ((35, 10), (10, 60), (-30, 40)), ((-50, 30), (-65, 30), (-75, 38))]), -360, 70),
        (np.array([(-60, -36), (60, -36), (60, 10), (0, 44), (-60, 10)]), -190, 70),
        (np.array([(-70, -34), (70, -34), (46, 34), (-46, 34)]), -20, 66),
        (np.array([(-55, -38)] + [(15 + 38 * math.cos(a), 38 * math.sin(a)) for a in np.linspace(-math.pi / 2, math.pi / 2, 24)] + [(-55, 38)]), 150, 68),
        (ellipse(22, 22), 300, 66), (ellipse(13, 13), 360, 66),
        (np.array([(0, 34), (40, -30), (-40, -30)]), 420, 70), (ellipse(14, 14), 455, -205),
    ]
    for pts, ox, oy in shapes:
        holes = np.maximum(holes, p.poly(T((pts + np.array([ox, oy])) * s)))
    body = plate * (1 - holes) * (0.48 + p.noise(30, amp=0.03))
    lit = cv2.warpAffine(holes, np.float32([[1, 0, 3], [0, 1, 2.4]]), (p.W, p.H), borderValue=0)
    body = np.maximum(body, cv2.GaussianBlur(holes * (1 - lit), (0, 0), 0.9) * 0.7)
    body = np.maximum(body, p.line(T(np.vstack([plate_pts, plate_pts[:1]])), 3) * 0.75)
    for i in range(41):
        x = (-470 + i * 23.5) * s
        L = (34 if i % 10 == 0 else (22 if i % 5 == 0 else 13)) * s
        body = np.maximum(body, p.line(T([(x, -258 * s), (x, -258 * s + L)]), 1.5) * 0.93)
    for _ in range(10):
        x0, y0 = p.rng.uniform(-85, 85), p.rng.uniform(-42, 42)
        a, L = p.rng.uniform(0, math.pi), p.rng.uniform(4, 22)
        seg = np.array([(x0, y0), (x0 + L * math.cos(a), y0 + L * math.sin(a) * 0.4)])
        body = np.maximum(body, p.line(T(seg), 1) * plate * (1 - holes) * p.rng.uniform(0.55, 0.62))
    corner = T([(90 * curl_corner[0], 47 * curl_corner[1])])[0]
    yy, xx = np.mgrid[0:p.H, 0:p.W].astype(np.float32)
    lift = np.clip(1 - np.hypot(xx - corner[0], yy - corner[1]) / (70 * PX_PER_MM), 0, 1)
    return body * (1 - lift) + p.project(body, 4.0) * lift


def controller(p, cx, cy, deg, cable_route):
    T = placer(cx, cy, deg)
    s = 0.153  # outline drawn 1000 units wide -> 153 mm
    outline = p.poly(T(controller_outline() * s))
    mm = PX_PER_MM
    blocked = p.zeros()
    for h in np.arange(0, 39, 3.0):
        if h < 8:
            sl = cv2.erode(outline, k((60 - h * 6) * s * mm / 7.71 * 6.5))
        elif h <= 28:
            sl = outline
        else:
            sl = cv2.erode(outline, k((4 + (h - 28) * 5) * mm / 7.71))
        blocked = np.maximum(blocked, p.project(sl, h))
    sticks = p.poly(T((ellipse(56, 56) + np.array([-255, -105])) * s)) + p.poly(T((ellipse(56, 56) + np.array([118, 34])) * s))
    buttons = p.poly(T((ellipse(84, 84) + np.array([262, -112])) * s)) + p.poly(T((ellipse(52, 52) + np.array([-118, 34])) * s))
    for h in np.arange(39, 46, 3.0):
        blocked = np.maximum(blocked, p.project(np.clip(sticks + buttons, 0, 1), h))
    for h in np.arange(46, 63, 3.0):
        blocked = np.maximum(blocked, p.project(np.clip(sticks, 0, 1), h))
    guide = cv2.GaussianBlur(p.poly(T((ellipse(30, 30) + np.array([0, -150])) * s)), (0, 0), 3)
    blocked *= 1 - 0.13 * guide
    for sx in (1, -1):
        gap = bezier_path((sx * 150, -226), [((sx * 230, -250), (sx * 330, -262), (sx * 420, -230))]) * s
        blocked *= 1 - 0.35 * cv2.GaussianBlur(p.line(T(gap), 4), (0, 0), 1.4)
    # cable (mm, relative to controller centre): lifted near the plug
    plug = p.poly(T(rounded_rect(7, 11, 1.2) + np.array([0, -40])))
    blocked = np.maximum(blocked, p.project(plug, 20))
    path = T(catmull(cable_route))
    n = len(path)
    flat = p.zeros()
    for i in range(n - 1):
        seg = path[i:i + 2]
        t = i / n
        h = 20 * (1 - t / 0.2) if t < 0.2 else 0.0
        if h < 0.5:
            flat = np.maximum(flat, p.line(seg, 3.6 * mm / 4 * 2))
        else:
            blocked = np.maximum(blocked, p.project(p.line(seg, 3.6 * mm / 4 * 2), h, 1.1) * 0.96)
    return np.maximum(blocked, p.project(flat, 0, 1.0) * 0.96)


def watch(p, cx, cy, deg):
    """Galaxy Watch 4 (44 mm) on a silicone strap, lying flat, buckle closed side up."""
    T = placer(cx, cy, deg)
    blocked = p.zeros()
    top_path = catmull([(0, -20), (1, -45), (8, -72), (22, -96), (40, -112)], 20)
    bot_path = catmull([(0, 20), (-2, 42), (-10, 62), (-24, 80)], 20)
    straps = np.clip(p.line(T(top_path), 20 * PX_PER_MM) + p.line(T(bot_path), 20 * PX_PER_MM)
                     + p.poly(T(ellipse(10, 10) + top_path[-1])), 0, 1)
    holes = p.zeros()
    for t in np.linspace(0.45, 0.92, 7):
        q = top_path[int(t * (len(top_path) - 1))]
        holes = np.maximum(holes, p.poly(T(ellipse(1.3, 1.3) + q)))
    straps = straps * (1 - holes)
    blocked = np.maximum(blocked, p.project(straps, 1.5, 0.9) * 0.97)
    end = bot_path[-1]
    d = bot_path[-1] - bot_path[-4]
    ang = math.atan2(d[0], -d[1])
    Rb = np.array([[math.cos(ang), -math.sin(ang)], [math.sin(ang), math.cos(ang)]])
    buckle = rounded_rect(24, 16, 3) @ Rb.T + end
    inner = rounded_rect(18, 10, 2) @ Rb.T + end
    frame = np.clip(p.poly(T(buckle)) - p.poly(T(inner)), 0, 1)
    keeper = p.poly(T(rounded_rect(24, 6, 2) @ Rb.T + bot_path[-8]))
    blocked = np.maximum(blocked, p.project(np.clip(frame + keeper, 0, 1), 4, 0.9))
    case = p.poly(T(ellipse(22, 22)))
    lugs = sum(p.poly(T(rounded_rect(6, 6, 1.5) + np.array([sx * 8, sy * 22]))) for sx in (-1, 1) for sy in (-1, 1))
    pushers = p.poly(T(rounded_rect(4, 5, 1.2) + np.array([23, -7]))) + p.poly(T(rounded_rect(4, 5, 1.2) + np.array([23, 7])))
    for h in np.arange(0, 11, 1.5):
        sl = cv2.erode(case, k(max(0, (h - 7) * 3 * PX_PER_MM / 4))) if h > 7 else case
        if h < 7:
            sl = np.maximum(sl, np.clip(lugs + pushers, 0, 1))
        blocked = np.maximum(blocked, p.project(sl, h))
    return blocked


def record(p, cx, cy, deg):
    """7-inch single on translucent coloured vinyl: grooves and the paper label print through."""
    T = placer(cx, cy, deg)
    disc = p.poly(T(ellipse(88.5, 88.5, 240)))
    label = p.poly(T(ellipse(45, 45, 180)))
    hole = p.poly(T(ellipse(19, 19, 120)))
    yy, xx = np.mgrid[0:p.H, 0:p.W].astype(np.float32)
    c = T([(0, 0)])[0]
    r = np.hypot(xx - c[0], yy - c[1]) / PX_PER_MM
    grooves = 0.035 * np.sin(r * 2 * math.pi / 1.3) + 0.02 * np.sin(r * 2 * math.pi / 0.9 + 1.0)
    bands = np.where((r > 84) | (r < 49) | ((r > 66) & (r < 67.5)), -0.06, 0.0)  # lead-in, run-out, track gap
    vinyl = (0.56 + grooves + bands) * disc
    rim = np.clip((r > 87.2) & (r < 88.5), 0, 1).astype(np.float32) * disc * 0.25
    m = np.clip(np.maximum(vinyl + rim, label * 0.94) * (1 - hole), 0, 1)
    contact = p.project(m, 0.6, 0.9)
    warped = p.project(m, 5.0)
    edge = T([(70, -50)])[0]
    w = np.clip(1 - np.hypot(xx - edge[0], yy - edge[1]) / (90 * PX_PER_MM), 0, 1) ** 1.5
    return contact * (1 - w) + np.maximum(contact, warped) * w


def index_cards(p, cx, cy, deg):
    """Three 5x3 in cards, fanned; cardstock passes a little light, ruled lines print faintly."""
    T = placer(cx, cy, deg)
    total = p.zeros()
    for i, (ox, oy, rot) in enumerate([(0, 0, 0), (9, -6, -7), (-7, 10, 9)]):
        a = math.radians(rot)
        R = np.array([[math.cos(a), -math.sin(a)], [math.sin(a), math.cos(a)]])
        card_pts = rounded_rect(127, 76, 2) @ R.T + np.array([ox, oy])
        card = p.poly(T(card_pts)) * 0.82
        lines = p.zeros()
        for j in range(1, 8):
            y = -38 + 8 + j * 8.6
            seg = np.array([(-63, y), (63, y)]) @ R.T + np.array([ox, oy])
            lines = np.maximum(lines, p.line(T(seg), 1))
        seg = np.array([(-63, -38 + 11), (63, -38 + 11)]) @ R.T + np.array([ox, oy])
        lines = np.maximum(lines, p.line(T(seg), 1.4))
        card = np.clip(card + lines * card * 0.12, 0, 1)
        total = 1 - (1 - total) * (1 - card)
    return p.project(total, 0.4, 0.9)


def basketball(p, cx, cy):
    """Size 7 ball (239 mm): a sphere's shadow is all penumbra, tilted along the sun."""
    T = placer(cx, cy, 0)
    r = 119.5
    blocked = p.zeros()
    for h in np.arange(1, 2 * r, 8.0):
        rr = math.sqrt(max(0.0, r * r - (h - r) ** 2))
        if rr < 4:
            continue
        blocked = np.maximum(blocked, p.project(p.poly(T(ellipse(rr, rr, 160))), h))
    return blocked


def net(p, cx, cy, deg):
    """Nylon basketball net laid flat: 12 rim loops and a tapering diamond mesh."""
    T = placer(cx, cy, deg)
    rows, n = 7, 12
    length, top_w, bot_w = 400.0, 330.0, 170.0
    width = lambda y: top_w + (bot_w - top_w) * y / length
    knots = []
    for r in range(rows + 1):
        y = r * length / rows
        wy = width(y)
        if r % 2 == 0:
            knots.append([(-wy / 2 + (j + 0.5) * wy / n, y) for j in range(n)])
        else:
            knots.append([(-wy / 2 + j * wy / n, y) for j in range(n + 1)])
    cords = p.zeros()
    for r in range(rows):
        a_, b_ = knots[r], knots[r + 1]
        for j, q in enumerate(a_):
            nbrs = (b_[j], b_[j + 1]) if r % 2 == 0 else tuple(b_[x] for x in (j - 1, j) if 0 <= x < len(b_))
            for t in nbrs:
                sag = np.array([(q[0] + t[0]) / 2 + p.rng.uniform(-2, 2), (q[1] + t[1]) / 2 + p.rng.uniform(-2, 2)])
                cords = np.maximum(cords, p.line(T(catmull([q, sag, t], 8)), 4.0 * PX_PER_MM))
    loops = p.zeros()
    for q in knots[0]:
        ring = ellipse(7, 9, 48) + np.array([q[0], q[1] - 9])
        loops = np.maximum(loops, p.line(T(np.vstack([ring, ring[:1]])), 3.0 * PX_PER_MM))
    knotm = p.zeros()
    for row in knots[1:]:
        for q in row:
            knotm = np.maximum(knotm, p.poly(T(ellipse(4, 4) + np.array(q))))
    m = np.clip(cords + loops + knotm, 0, 1)
    return np.maximum(p.project(m, 1.0, 0.9), p.project(np.clip(loops + knotm, 0, 1), 4.0)) * 0.95


# --------------------------------------------------------------- chemistry

def chemistry(p):
    return (1 + p.noise(340, 26, amp=0.028, angle=-6) + np.clip(p.noise(150) - 0.9, 0, None) * 0.06
            + p.noise(7, 320, amp=0.005) + p.noise(420, amp=0.035))


def dust(p, blocked):
    out = blocked.copy()
    for _ in range(int(70 * p.W * p.H / (2400 * 1500))):
        x, y, r = p.rng.uniform(0, p.W), p.rng.uniform(0, p.H), p.rng.uniform(0.6, 2.2)
        cv2.circle(out, (int(x * 4), int(y * 4)), max(1, int(r * 4)), float(p.rng.uniform(0.5, 0.95)), -1, cv2.LINE_AA, 2)
    for _ in range(2):
        p0 = np.array([p.rng.uniform(200, p.W - 200), p.rng.uniform(150, p.H - 150)])
        a = p.rng.uniform(0, math.pi)
        ctrl = [p0 + np.array([math.cos(a + p.rng.uniform(-0.5, 0.5)) * d, math.sin(a + p.rng.uniform(-0.5, 0.5)) * d]) for d in (0, 40, 85, 130)]
        out = np.maximum(out, cv2.GaussianBlur(p.line(catmull(ctrl, 30), 2), (0, 0), 0.7) * 0.8)
    return out


def tiled_grain(plate_path, W, H):
    plate = cv2.imread(plate_path, cv2.IMREAD_COLOR).astype(np.float32)
    region = plate[2720:3420, 400:2700]
    hp = region - cv2.GaussianBlur(region, (0, 0), 30)
    tile = np.vstack([hp, hp[::-1]])
    tile = np.hstack([tile, tile[:, ::-1]])
    return np.tile(tile, (math.ceil(H / tile.shape[0]), math.ceil(W / tile.shape[1]), 1))[:H, :W]


def develop(p, objects, grain, blue="#0f3a63", white="#e3e9e8", gamma=0.85):
    blocked = p.zeros()
    for m in objects:
        blocked = 1 - (1 - blocked) * (1 - np.clip(m, 0, 1))
    blocked = dust(p, blocked)
    chem = chemistry(p)
    density = np.clip(1 - blocked, 0, 1) ** gamma * chem
    density = np.clip(np.maximum(density, cv2.GaussianBlur(density, (0, 0), 3.0) * 0.55), 0, 1)
    b, w = hex_bgr(blue), hex_bgr(white)
    img = w[None, None] * (1 - density[..., None]) + b[None, None] * density[..., None]
    lum = grain.mean(axis=2, keepdims=True)
    amp = (0.5 + 0.5 * density[..., None]) * (0.85 + 0.3 * (chem[..., None] - 1) / 0.05)
    return np.clip(img + (lum * 0.8 + grain * 0.2) * amp * 1.15, 0, 255).astype(np.uint8)


def scene_desktop(grain_src):
    p = Paper(2400, 1500, 21)
    objs = {
        "record": record(p, 470, 300, 0),
        "cards": index_cards(p, 1060, 330, 7),
        "watch": watch(p, 1080, 760, -28),
        "controller": controller(p, 1880, 760, 13, [(0, -46), (1, -60), (9, -74), (29, -79), (40, -68), (32, -55), (17, -59), (14, -82), (24, -102), (50, -112), (82, -122), (112, -145)]),
        "stencil": stencil(p, 1330, 1170, -8),
        "net": net(p, 2150, 1060, -38),
    }
    img = develop(p, objs.values(), tiled_grain(grain_src, p.W, p.H))
    return p, objs, img


def scene_mobile(grain_src):
    p = Paper(1200, 2100, 33)
    objs = {
        "record": record(p, 330, 260, 0),
        "cards": index_cards(p, 880, 470, 10),
        "watch": watch(p, 300, 900, -20),
        "controller": controller(p, 820, 1020, 18, [(0, -46), (2, -62), (12, -74), (30, -76), (38, -66), (28, -56), (14, -62), (12, -84), (20, -104), (44, -116), (70, -130)]),
        "stencil": stencil(p, 520, 1560, -10),
        "net": net(p, 980, 1820, -30),
    }
    img = develop(p, objs.values(), tiled_grain(grain_src, p.W, p.H))
    return p, objs, img


def hotspots(objs, W, H, thresh=0.6):
    """Bounding boxes (percent of frame) of each object's solid area, for link hit areas."""
    out = {}
    for name, m in objs.items():
        ys, xs = np.where(m > thresh)
        if len(xs) == 0:
            continue
        x0, x1 = max(0, xs.min()), min(W, xs.max())
        y0, y1 = max(0, ys.min()), min(H, ys.max())
        out[name] = [round(100 * x0 / W, 2), round(100 * y0 / H, 2), round(100 * (x1 - x0) / W, 2), round(100 * (y1 - y0) / H, 2)]
    return out


def label_map(objs, W, H, gw, thresh=0.5):
    """Which object owns each cell of a coarse grid, run-length encoded.

    The page hit-tests the pointer against this instead of bounding boxes, which
    overlap (the net's box covers the controller's grips)."""
    gh = round(gw * H / W)
    keys = list(objs)
    cell = W / gw
    grow = k(cell * 1.5)  # thin cords, cut-outs and centre holes count as the object
    stack = np.stack([
        cv2.resize(cv2.dilate((objs[key] > 0.3).astype(np.float32), grow), (gw, gh), interpolation=cv2.INTER_AREA)
        for key in keys
    ])
    owner = np.where(stack.max(axis=0) > thresh, stack.argmax(axis=0), -1).ravel()
    runs, start = [], 0
    for i in range(1, len(owner) + 1):
        if i == len(owner) or owner[i] != owner[start]:
            runs.append([int(owner[start]), i - start])
            start = i
    return {"w": gw, "h": gh, "keys": keys, "runs": runs}


PLATE_URL = "https://images.metmuseum.org/CRDImages/ph/original/DP-17302-078.jpg"  # Met 291572, public domain


def fetch_plate(cache_dir):
    os.makedirs(cache_dir, exist_ok=True)
    path = os.path.join(cache_dir, "DP-17302-078.jpg")
    if not os.path.exists(path):
        import urllib.request
        urllib.request.urlretrieve(PLATE_URL, path)
    return path


def save_variants(img_bgr, stem, widths):
    from PIL import Image
    rgb = Image.fromarray(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB))
    for w in widths:
        h = round(rgb.height * w / rgb.width)
        im = rgb.resize((w, h), Image.LANCZOS)
        im.save(f"{stem}-{w}.avif", quality=62)
        im.save(f"{stem}-{w}.webp", quality=80, method=6)


def save_icons(img_bgr, objs, static_dir):
    from PIL import Image
    x, y, w, h = objs
    side = int(max(w, h) * 1.08)
    cx, cy = x + w // 2, y + h // 2
    crop = img_bgr[max(0, cy - side // 2):cy + side // 2, max(0, cx - side // 2):cx + side // 2]
    icon = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
    for size, name in ((512, "android-chrome-512x512.png"), (192, "android-chrome-192x192.png"), (180, "apple-touch-icon.png")):
        icon.resize((size, size), Image.LANCZOS).save(os.path.join(static_dir, name))
    icon.resize((48, 48), Image.LANCZOS).save(os.path.join(static_dir, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])


def bbox_px(mask, thresh=0.6):
    ys, xs = np.where(mask > thresh)
    return int(xs.min()), int(ys.min()), int(xs.max() - xs.min()), int(ys.max() - ys.min())


if __name__ == "__main__":
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    static_dir = os.path.join(root, "static")
    out_dir = os.path.join(static_dir, "print")
    data_dir = os.path.join(root, "src", "lib", "print")
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)
    plate = fetch_plate(os.path.join(os.path.dirname(__file__), ".cache"))

    p, objs, img = scene_desktop(plate)
    save_variants(img, os.path.join(out_dir, "hero"), (1600, 2400))
    og = cv2.resize(img, (1600, 1000), interpolation=cv2.INTER_AREA)[85:925, :]
    cv2.imwrite(os.path.join(static_dir, "og.jpg"), cv2.resize(og, (1200, 630), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 86])
    save_icons(img, bbox_px(objs["record"]), static_dir)
    spots = {"desktop": hotspots(objs, p.W, p.H), "desktopMap": label_map(objs, p.W, p.H, 160)}

    p, objs, img = scene_mobile(plate)
    save_variants(img, os.path.join(out_dir, "hero-mobile"), (780, 1200))
    spots["mobile"] = hotspots(objs, p.W, p.H)

    with open(os.path.join(data_dir, "hotspots.json"), "w") as f:
        json.dump(spots, f, indent=2)
    print("wrote", out_dir, "and", data_dir)
