export function getRequiredElement<T extends HTMLElement>(
  id: string,
  elementType: new (...args: any[]) => T
): T {
  const element = document.getElementById(id);

  if (!(element instanceof elementType)) {
    throw new Error(
      `Element with id="${id}" was not found or has an invalid type`
    );
  }

  return element;
}

export function getCanvasContext(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas 2D context is not supported");
  }

  return context;
}