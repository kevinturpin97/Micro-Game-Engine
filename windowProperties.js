class WindowProperties {
    #size = {
        width: 0,
        height: 0
    };

    constructor(toUpdate = []) {
        if (toUpdate.length > 0) {
            toUpdate.forEach((update) => {
                if (update?.width === undefined || update?.height === undefined) {
                    throw new Error('Invalid update');
                }
            });
        }

        window.addEventListener('resize', () => this.#setSize(toUpdate));
        window.addEventListener('orientationchange', () => this.#setSize(toUpdate));

        this.#setSize(toUpdate);
    }

    #setSize(toUpdate = []) {
        const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        this.#size = {
            width: parseFloat(width),
            height: parseFloat(height)
        };

        toUpdate.forEach((update) => {
            update.width = this.#size.width;
            update.height = this.#size.height;
        });
    }

    getSize() {
        return this.#size;
    }
}

export { WindowProperties };