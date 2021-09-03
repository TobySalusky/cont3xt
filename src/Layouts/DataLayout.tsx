import {infoBox} from "../Components/ColorDictBox";
import {toColorText} from "../Util/Util";

export class DataLayout {
    genReport(): string|undefined {
        return "UNKNOWN_DATA_LAYOUT";
    }

    genUI(): JSX.Element | null {
        return <p>TODO:</p>;
    }
}

export class HiddenLayout extends DataLayout {
    genReport(): undefined {
        return undefined;
    }

    genUI(): null {
        return null;
    }
}

export class ClosedLayout extends DataLayout {

    title: string;
    data: any;

    constructor(title: string, data: any) {
        super();
        this.title = title;
        this.data = data;
    }

    genReport(): string {
        return '';
    }

    genUI(): JSX.Element {
        return infoBox(this.title, toColorText(this.data), false);
    }
}

export const layouts = {
    hidden: new HiddenLayout()
};
