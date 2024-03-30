class QueryManager {
    roleDist = [];

    async init(ms) {
        while(true) {
            if(this.roleDist.length <= 0) {
              await new Promise(resolve => setTimeout(resolve, ms));
              continue;
            }
            let task = this.roleDist[0];
            await task();

            this.roleDist = this.roleDist.splice(1);
        }
    }

    query(handler) {
        this.roleDist.push(handler);
    }
}

module.exports = QueryManager;