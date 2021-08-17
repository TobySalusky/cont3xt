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

export const layouts = {
    hidden: new HiddenLayout()
};
