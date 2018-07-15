import React from 'react';
import {NavLink} from 'fluxible-router';
import qs from 'querystring';

import {getLanguageName} from '../../../common';
import {flagForLocale} from '../../../configs/locales';

class TranslationItem extends React.Component {
    render() {
        let href = '';
        if (this.props.clickable) {
            // build the href!
            let routeName = 'deck';
            let navParams = Object.assign({ slug: this.props.slug || '_' }, this.props.selector);
            let queryParams = { language: this.props.language };

            href = ['', routeName, navParams.id, navParams.slug, navParams.stype, navParams.sid, navParams.spath].join('/');
            href += '?' + qs.stringify(queryParams);
        }

        let flagName = flagForLocale(this.props.language);
        let iconName = flagName ? flagName + ' flag': 'flag icon';

        return (this.props.clickable === true) ?
          <NavLink className="item" href={href} activeElement='div'>
              <div className="content">
                  <div className="header">
                      <i className={iconName}></i>{getLanguageName(this.props.language)} { this.props.primary ? '(primary)' : ''}
                  </div>
              </div>
          </NavLink>
          :
          <div className="item">
              <div className="content">
                  <div className="header">
                      <i className={iconName}></i>{getLanguageName(this.props.language)} { this.props.primary ? '(primary)' : ''}
                  </div>
              </div>
          </div>;
    }
}

export default TranslationItem;