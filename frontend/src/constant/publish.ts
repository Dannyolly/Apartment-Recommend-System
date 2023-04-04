import { getDimension, getPlatform , Platform } from "../utils/Equipment";

const height = getDimension().height

const platform = getPlatform()

type ModalHeight = {
    [ K in Platform ] : {
        height : Number 
    }
}
/**
 * @description the pulish height
 */

const modalHeight:ModalHeight = {
    ipad: {
        height: height * 0.2
    },
    windows: {
        height: height * 0.3
    },
    ios: {
        height: height * 0
    },
    macOS: {
        height: 0
    },
    android: {
        height: 0
    },
    Ubuntu: {
        height: 0
    },
    other:{
        height: 0
    }
}


export {
    ModalHeight,
    modalHeight
};

