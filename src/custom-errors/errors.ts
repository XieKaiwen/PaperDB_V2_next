class DataFetchingError extends Error {
    statusCode: number
    constructor(message: string  = "An error occurred while fetching data", statusCode: number = 500) {
        super(message); 
        this.name = "DataFetchingError";
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, DataFetchingError.prototype);
    }
    
    toString(): string {
        return `${this.name}: ${this.statusCode}: ${this.message}`
    }
}