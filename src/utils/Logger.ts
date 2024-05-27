class Logger {
    private name?: string;

    constructor(name?: string) {
        if (name == null)
            name = "";
        this.name = name;
    }

    private startGroup() {
        if (this.name != null)
            console.group(this.name);
    }

    private endGroup() {
        if (this.name != null)
            console.groupEnd();
    }

    /**
     * Print info into console
     */
    public info(message?: any, ...optionalParams: any[]) {
        this.startGroup();
        console.log(message, ...optionalParams);
        this.endGroup();
    }

    /**
     * Print error message into console
     */
    public error(message?: any, ...optionalParams: any[]) {
        this.startGroup();
        console.error(message, ...optionalParams);
        this.endGroup();
    }

    /**
     * Print warning message into console
     */
    public warn(message?: any, ...optionalParams: any[]) {
        this.startGroup();
        console.warn(message, ...optionalParams);
        this.endGroup();
    }
}

export default Logger;