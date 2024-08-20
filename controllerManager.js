class ControllerManager {
    #workersAvailable = navigator.hardwareConcurrency;
    #vectorWorkers = [];
    #subscribers = {};

    constructor() {
        console.log(this.#workersAvailable + ' workers available');

        for (let i = 0; i < this.#workersAvailable; i++) {
            this.#vectorWorkers.push(new Worker('workers/vectorWorker.js'));
            this.#subscribers[i] = 0;
        }
    }

    /**
     * @param {Worker} Worker
     * 
     * @returns {number} id
     */
    _addWorker(Worker) {
        this.#vectorWorkers.push(new Worker('workers/vectorWorker.js'));

        return this.#vectorWorkers.length - 1;
    }

    /**
     * @param {number} id
     */
    _removeWorker(id) {
        this.#vectorWorkers = this.#vectorWorkers.filter((_, index) => index !== id);
    }

    /**
     * @returns {Worker}
     */
    _getWorker(id) {
        return this.#vectorWorkers[id];
    }

    /**
     * @returns {Worker[]}
     */
    _getWorkers() {
        return this.#vectorWorkers;
    }

    /**
     * @returns {number}
     */
    _getWorkersAvailable() {
        return this.#workersAvailable;
    }

    _getSubscribers() {
        return this.#subscribers;
    }

    /**
     * @returns {number} worker id subscribed
     */
    _subscribe() {
        for (let i = 0; i < this.#workersAvailable; i++) {
            if (i < this.#workersAvailable - 1 && this.#subscribers[i] === this.#subscribers[i + 1]) {
                continue;
            }

            this.#subscribers[i] += 1;
            return i;
        }
    
        throw new Error('No worker available');
    }

    _unsubscribe(id) {
        this.#subscribers[id] -= 1;

        console.log('Subscriber removed:');
        console.table(this.#subscribers);
    }
}

export { ControllerManager };