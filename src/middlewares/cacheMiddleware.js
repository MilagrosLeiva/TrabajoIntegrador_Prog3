import apicache from 'apicache';


const apicacheInstance = apicache.options ({debug:false}).newInstance();

export const cache = apicacheInstance.middleware;


export const limpiarCache = (req,res,next) => {
    apicacheInstance.clear();
    next();
};