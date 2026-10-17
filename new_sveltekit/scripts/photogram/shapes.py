"""Shape helpers for the photogram renderer: bezier/catmull paths and object outlines."""
import math

import numpy as np


def cubic(p0, p1, p2, p3, steps=40):
    t = np.linspace(0, 1, steps)[:, None]
    return ((1 - t) ** 3) * p0 + 3 * ((1 - t) ** 2) * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3


def bezier_path(start, segs):
    pts = [np.array(start, float)]
    cur = np.array(start, float)
    for c1, c2, end in segs:
        seg = cubic(cur, np.array(c1, float), np.array(c2, float), np.array(end, float))
        pts.extend(seg[1:])
        cur = np.array(end, float)
    return np.array(pts)


def catmull(points, steps=24):
    p = np.array(points, float)
    p = np.vstack([p[0], p, p[-1]])
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for t in np.linspace(0, 1, steps, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(p[-2])
    return np.array(out)


def rounded_rect(w, h, r, steps=10):
    pts = []
    for cx, cy, a0 in ((w / 2 - r, -h / 2 + r, -90), (w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90), (-w / 2 + r, -h / 2 + r, 180)):
        for a in np.linspace(a0, a0 + 90, steps):
            pts.append((cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a))))
    return np.array(pts)


def ellipse(rx, ry, steps=72):
    a = np.linspace(0, 2 * math.pi, steps, endpoint=False)
    return np.stack([rx * np.cos(a), ry * np.sin(a)], 1)


def controller_outline():
    # right half, clockwise from top centre; mirrored for the left half
    right = [
        ((60, -232), (150, -252), (232, -270)),     # top edge rising to right bumper
        ((300, -284), (372, -282), (420, -252)),    # bumper crown
        ((468, -222), (490, -170), (497, -110)),    # shoulder
        ((506, -20), (512, 90), (488, 190)),        # outer side, nearly straight
        ((468, 270), (432, 334), (374, 338)),       # grip heel
        ((318, 342), (278, 314), (254, 264)),       # grip toe turning in
        ((224, 196), (176, 60), (104, 48)),         # inner grip up into the arch
        ((62, 42), (28, 42), (0, 42)),              # arch centre
    ]
    pts_r = [(0, -232)] + [seg[2] for seg in right]
    segs_l = []
    for i in range(len(right) - 1, -1, -1):
        c1, c2, _end = right[i]
        start = pts_r[i]
        segs_l.append(((-c2[0], c2[1]), (-c1[0], c1[1]), (-start[0], start[1])))
    return bezier_path((0, -232), right + segs_l)


def hex_bgr(h):
    h = h.lstrip('#')
    return np.array([int(h[4:6], 16), int(h[2:4], 16), int(h[0:2], 16)], np.float32)
