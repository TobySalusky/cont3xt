import {withStyles} from "@material-ui/core/styles";
import {Tooltip} from "@material-ui/core";

const DarkTooltip = withStyles(() => ({
    tooltip: {
        backgroundColor: '#222222',
        color: 'white',
        border: '1px solid #888888',
        fontSize: 12,
        zIndex: 9,
    },
}))(Tooltip);
export default DarkTooltip;
