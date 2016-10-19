import React, {Component, PropTypes } from "react";
import { connect } from "react-redux";
import {
    theme as ThemeActions
} from "actions";
import Localization from "localization";
import GridCell from "dnn-grid-cell";
import Button from "dnn-button";
import OverflowText from "dnn-text-overflow-wrapper";

import SvgIcon from "../../SvgIcon";
import utils from "utils";

import "./style.less";

class Theme extends Component {
    constructor() {
        super();
        this.state = {};
    }

    selectedAsSite(){
        const {props, state} = this;
        let theme = props.theme;
        let currentTheme = props.currentTheme;

        if(theme.type === 0){
            return currentTheme.SiteLayout.themeName === theme.packageName;
        } else {
            return currentTheme.SiteContainer.themeName === theme.packageName;
        }
    }

    getClassName(){
        const {props, state} = this;
        let theme = props.theme;
        let currentTheme = props.currentTheme;
        let className = theme.type === 0 ? 'theme-skin' : 'theme-container';

        let selected = false;

        if(this.selectedAsSite()){
            className += " selected";
        }

        return className;
    }

    applyDefaultTheme(){
        const {props, state} = this;
        let theme = props.theme;

        utils.utilities.confirm(Localization.get("ApplyConfirm"), Localization.get("Confirm"), Localization.get("Cancel"), function(){
            props.dispatch(ThemeActions.applyDefaultTheme(theme.packageName));
        });
    }

    previewTheme(){
        const {props, state} = this;
        let theme = props.theme;

        let previewUrl = utils.params.settings.previewUrl;
        window.open(previewUrl + "?SkinSrc=" + theme.defaultThemeFile);
    }

    renderActions(){
        const {props, state} = this;
        let theme = props.theme;
        let type = theme.type;

        if(this.selectedAsSite()){
            return <span className="checkmark"><SvgIcon name="Checkmark" /></span>;
        }

        return <span className="actions">
            <ul>
                <li onClick={this.previewTheme.bind(this)}><SvgIcon name="View" /></li>
                <li onClick={this.applyDefaultTheme.bind(this)}><SvgIcon name="Apply" /></li>
                <li><SvgIcon name="Trash" /></li>
            </ul>
        </span>;
    }

    renderThumbnail(){
        const {props, state} = this;

        let theme = props.theme;
        let className = 'thumbnail' + (theme.thumbnail ? '' : ' empty');

        return <span className={className}>
            {theme.thumbnail ? <img src={theme.thumbnail} /> : <SvgIcon name="EmptyThumbnail" />}
            {this.renderActions()}
        </span>;
    }
    
    render() {
        const {props, state} = this;

        return (
            <div className={this.getClassName()}>
                {this.renderThumbnail()}
                <OverflowText text={props.theme.packageName} maxWidth={168} className="title" />
            </div>
        );
    }
}

Theme.propTypes = {
    dispatch: PropTypes.func.isRequired,
    theme: PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentTheme: state.theme.currentTheme
    };
}

export default connect(mapStateToProps)(Theme);