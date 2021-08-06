export const isDict = variable => {
    return typeof variable === "object" && !Array.isArray(variable) && variable != null;
};

export const isArray = variable => Array.isArray(variable);