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

const app = function () {
    const canvases = document.querySelectorAll("canvas");

    canvases.forEach((canvas) => {
        const parent = canvas.closest("p");
        const { width, height } = parent ? parent.getBoundingClientRect() : { width: 200, height: 100 };
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");

        draw(ctx, width, height)
        setInterval(() => draw(ctx, width, height), 1000);
    });
};

document.addEventListener("DOMContentLoaded", app);
