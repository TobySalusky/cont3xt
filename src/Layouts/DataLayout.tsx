import {infoBox} from "../Components/ColorDictBox";
import {CollapsableFieldBox} from "../Components/CollapsableFieldBox";
import {toColorText} from "../Util/Util";

export class DataLayout {
    genReport() : string {
        return "TODO:";
    }
    genUI(): JSX.Element | null {
        return <p>TODO:</p>;
    }
}

export class HiddenLayout extends DataLayout {
    genReport(): string {
        return '';
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
