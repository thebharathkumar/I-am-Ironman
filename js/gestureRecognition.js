export class GestureRecognition {
    constructor() {
        this.gestures = {
            pinch: { name: 'pinch', confidence: 0 },
            open_palm: { name: 'open_palm', confidence: 0 },
            fist: { name: 'fist', confidence: 0 },
            pointing: { name: 'pointing', confidence: 0 },
            peace: { name: 'peace', confidence: 0 },
            thumbs_up: { name: 'thumbs_up', confidence: 0 },
            unknown: { name: 'unknown', confidence: 0 }
        };
    }

    recognizeGesture(landmarks) {
        if (!landmarks || landmarks.length !== 21) {
            return this.gestures.unknown;
        }

        // Calculate finger states (extended or bent)
        const fingerStates = this.getFingerStates(landmarks);

        // Recognize specific gestures
        if (this.isPinch(landmarks, fingerStates)) {
            return { ...this.gestures.pinch, confidence: 0.9 };
        }
        else if (this.isOpenPalm(fingerStates)) {
            return { ...this.gestures.open_palm, confidence: 0.9 };
        }
        else if (this.isFist(fingerStates)) {
            return { ...this.gestures.fist, confidence: 0.9 };
        }
        else if (this.isPointing(fingerStates)) {
            return { ...this.gestures.pointing, confidence: 0.9 };
        }
        else if (this.isPeace(fingerStates)) {
            return { ...this.gestures.peace, confidence: 0.9 };
        }
        else if (this.isThumbsUp(fingerStates)) {
            return { ...this.gestures.thumbs_up, confidence: 0.9 };
        }

        return { ...this.gestures.unknown, confidence: 0 };
    }

    getFingerStates(landmarks) {
        // Returns whether each finger is extended or bent
        return {
            thumb: this.isFingerExtended(landmarks, 'thumb'),
            index: this.isFingerExtended(landmarks, 'index'),
            middle: this.isFingerExtended(landmarks, 'middle'),
            ring: this.isFingerExtended(landmarks, 'ring'),
            pinky: this.isFingerExtended(landmarks, 'pinky')
        };
    }

    isFingerExtended(landmarks, finger) {
        const fingerIndices = {
            thumb: [1, 2, 3, 4],
            index: [5, 6, 7, 8],
            middle: [9, 10, 11, 12],
            ring: [13, 14, 15, 16],
            pinky: [17, 18, 19, 20]
        };

        const indices = fingerIndices[finger];
        if (!indices) return false;

        // For thumb, check horizontal extension
        if (finger === 'thumb') {
            const tip = landmarks[indices[3]];
            const base = landmarks[indices[0]];
            return Math.abs(tip.x - base.x) > 0.1;
        }

        // For other fingers, check vertical extension
        const tip = landmarks[indices[3]];
        const pip = landmarks[indices[1]];
        return tip.y < pip.y - 0.05;
    }

    isPinch(landmarks, fingerStates) {
        // Thumb and index finger close together, others bent
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];

        const distance = this.calculateDistance(thumbTip, indexTip);

        return distance < 0.05 &&
               !fingerStates.middle &&
               !fingerStates.ring &&
               !fingerStates.pinky;
    }

    isOpenPalm(fingerStates) {
        // All fingers extended
        return fingerStates.thumb &&
               fingerStates.index &&
               fingerStates.middle &&
               fingerStates.ring &&
               fingerStates.pinky;
    }

    isFist(fingerStates) {
        // All fingers bent
        return !fingerStates.thumb &&
               !fingerStates.index &&
               !fingerStates.middle &&
               !fingerStates.ring &&
               !fingerStates.pinky;
    }

    isPointing(fingerStates) {
        // Index extended, others bent
        return !fingerStates.thumb &&
               fingerStates.index &&
               !fingerStates.middle &&
               !fingerStates.ring &&
               !fingerStates.pinky;
    }

    isPeace(fingerStates) {
        // Index and middle extended, others bent
        return !fingerStates.thumb &&
               fingerStates.index &&
               fingerStates.middle &&
               !fingerStates.ring &&
               !fingerStates.pinky;
    }

    isThumbsUp(fingerStates) {
        // Thumb extended, others bent
        return fingerStates.thumb &&
               !fingerStates.index &&
               !fingerStates.middle &&
               !fingerStates.ring &&
               !fingerStates.pinky;
    }

    calculateDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        const dz = (point1.z || 0) - (point2.z || 0);
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}
