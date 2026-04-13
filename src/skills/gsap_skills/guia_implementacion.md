# GSAP Skills - Core Animation Library

Esta skill define los patrones de animación de alto nivel utilizados en el proyecto financiero.

## Patrones Disponibles:

1.  **Staggered Entrance**: Animación de entrada en cascada para listas o cuadrículas de tarjetas.
2.  **Float Interaction**: Efecto de flotación suave para elementos destacados.
3.  **Scroll Revelation**: Activación de animaciones basadas en el scroll usando `ScrollTrigger`.
4.  **Magnetic Hover**: Efecto donde el elemento sigue ligeramente la posición del cursor.

## Ejemplo de Uso rápido:

```javascript
import { gsap } from "gsap";

export const animateIn = (targets) => {
  gsap.from(targets, {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: "power3.out"
  });
};
```
