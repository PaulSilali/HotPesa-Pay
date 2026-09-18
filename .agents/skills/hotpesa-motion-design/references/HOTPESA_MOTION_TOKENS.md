# HotPesa motion tokens

| Token | Value | Use |
|---|---:|---|
| quick | 120 ms | tap, toggle, focus |
| standard | 200 ms | inline state and card updates |
| slow | 300 ms | modal/context transition |
| enter | cubic-bezier(0.2, 0, 0, 1) | entry |
| exit | cubic-bezier(0.3, 0, 1, 1) | exit |
| spatial | transform + opacity | preferred properties |
| stagger | 30–50 ms; total <300 ms | short lists only |

Reduced motion removes spatial travel and continuous loops, uses an immediate state swap
or short opacity transition, and retains text/icon feedback. Do not animate width, height,
margin or expensive filters in repeated field flows. Target 60 fps and verify on the
lowest supported Android device class.
