import { Engine } from "./engine.js";

(() => {
    const engine = new Engine();
    const btn = document.getElementById('btn');

    engine.init();

    btn.addEventListener('click', () => {
        engine.launch();
    });
})();