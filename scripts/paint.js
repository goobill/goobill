// https://nmcode.hashnode.dev/javascript-canvas-api-drawing-random-patterns
const draw = function (ctx, width, height) {
    const size = 20;
    const columns = Math.floor(width / size);
    const rows = Math.floor(height / size);

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            ctx.fillStyle = Math.random() < 0.5 ? "black" : "white";
            ctx.fillRect(size * c, size * r, size, size);
        }
    }
};

const getResponsiveDimensions = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (w >= 1024) {
        // Desktop
        return { width: w * 0.6, height: h * 0.3 };
    } else if (w >= 768) {
        // Tablet
        return { width: w * 0.6, height: h * 0.65 };
    } else {
        // Phone
        return { width: w * 0.95, height: h * 0.3 };
    }
};

const app = function () {
    const canvases = document.querySelectorAll("canvas");

    canvases.forEach((canvas) => {
        const { width, height } = getResponsiveDimensions();
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        draw(ctx, width, height);
    });
};

document.addEventListener("DOMContentLoaded", app);
