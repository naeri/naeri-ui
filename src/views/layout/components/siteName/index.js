import React from 'react';

import Spinner from 'components/spinner';

import css from './style.css';

class SiteName extends React.Component {
    constructor() {
        super();
        
        this.state = {
            name: ''
        };
    }

    static contextTypes = {
        siteModule: React.PropTypes.object
    }

    async componentDidMount() {
        const { siteModule } = this.context;

        this.setState({
            name: await siteModule.getSiteName()
        });
    }

    render() {
        const { name } = this.state;

        let content = (() => {
            if (name) {
                return name;
            }

            return ( 
                <Spinner 
                    innerStyle={{ width: '30px', height: '30px' }}
                    color="#a0a0a0"
                    align="left" />
            );
        })();

        return (
            <div className={css.wrap}>
                {content}
            </div>
        )
    }
}

export default SiteName;