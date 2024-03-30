class Event {
    constructor(client, {
		name = null,
		enabled = true
    }){
        this.client = client;
        this.name = name;
        this.enabled = enabled;
        if(!this.name) throw new Error('Komut ismi belirlenmediği için bu komut atlandı.');
    }

    on() {
        if(!this.enabled) return;
        this.client.on(this.name, this.onLoad);  
    }
    
}

module.exports = { Event };