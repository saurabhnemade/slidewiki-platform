import React from 'react';
import PropTypes from 'prop-types';
import { handleRoute } from 'fluxible-router';
import PresentationSlide from './PresentationSlide';
import { connectToStores } from 'fluxible-addons-react';
import { Microservices } from '../../../configs/microservices';
import PresentationStore from '../../../stores/PresentationStore';
import loadPresentation from '../../../actions/loadPresentation';
import ChartRender from '../ContentPanel/util/ChartRender';
// if(process.env.BROWSER){
//    require('../../../assets/css/PresentationDefaults.css');
// }

class Presentation extends React.Component{
    constructor(props){
        super(props);
        this.playerCss = { height: '100%', position: 'absolute', top: '0' };
        this.clearStyle = { clear: 'both' };
        this.startingSlide = this.props.PresentationStore.selector.sid;
        this.revealDiv = null;
        this.secret = props.currentRoute.query.secret;
        this.id = props.currentRoute.query.id;
    }

    componentDidMount(){
        if(process.env.BROWSER){
            //$('[style*="absolute"]').children().attr('tabindex', 0);

            //remove existing tabindices
            $('[style*="absolute"]').each(function () {
                let el = $(this);
                if(el.attr('tabindex') !== 0)
                    el.attr('tabindex', 0);
            });
            //add tabindices to all children in absolute elements
            $('[style*="absolute"]').each(function () {
                $(this).children().attr('tabindex', 0);
                //if($(this).attr('tabindex') !== 0)
                //{
                //    $(this).attr('tabindex', 0);
                //}
            });
            //TODO: add hidden element at start of PPTX slide content + to focus on this.


             //loading reveal style

            // $('html.ios, html.ios body').css('height': '100% !important');
            // Get the theme information, and download the stylesheet

            this.revealDiv.style.display = 'inline';


            //SWIK-1321 - Non-canvas/pptx2html content is not scaled in presentation mode and bottom content is hidden
            let pptxwidth = '100%'; //use 100% of screen width
            let pptxheight = '100%'; //use 100% of screen height
            //if($('.pptx2html').html() !== ''){
            if($('.pptx2html').html()){
                pptxwidth = $('.pptx2html').width();
                pptxheight = $('.pptx2html').height();
            } else {
                pptxwidth = '100%';
                pptxheight = '100%';
            }

            window.location.hash = '#slide-' + this.startingSlide;

            let multiplexFileToLoad = (this.secret) ? '/custom_modules/reveal.js/plugin/multiplex/master.js' : '/custom_modules/reveal.js/plugin/multiplex/client.js' ;
            multiplexFileToLoad = (this.id) ? multiplexFileToLoad : '' ;
            let multiplexConfig = (this.secret) ? {secret: this.secret, id: this.id} : {secret: null, id: this.id};
            multiplexConfig.url = Microservices.webrtc.uri;
            multiplexConfig = (this.id) ? multiplexConfig : {};
            let dependencySocketIO = (this.id) ? Microservices.webrtc.uri.replace('http:','').replace('https:','') + '/socket.io/socket.io.js' : '' ;
            Reveal.initialize({
                width: pptxwidth,
                height: pptxheight,
                // margin: 0.2,
                transition: 'none',
                backgroundTransition: 'none',
                history: true,
                viewDistance: 2,
                dependencies: [
                    { src: dependencySocketIO, async: true },
                    { src: multiplexFileToLoad, async: true },
                    { src: '/custom_modules/reveal.js/plugin/notes/notes.js', async: true },
                    { src: '/custom_modules/reveal.js/plugin/zoom-js/zoom.js', async: true },
                    // { src: '/custom_modules/reveal.js/plugin/reveal.js-toolbar/toolbar.js', async: true},
                    { src: '/reveal.js-menu/menu.js', async: true},
                    { src: '/custom_modules/reveal.js/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
                    // Plugin from https://github.com/marcysutton/reveal-a11y
                    //{ src: '/custom_modules/reveal.js/plugin/accessibility/helper.js', async: false,condition: function() {return !!document.body.classList;}}
                ],
                keyboard: {
                    72: null,
                    78: null
                },
                toolbar: {
                    captureMenu: false,  // set to false so it doesn't crash the plugin
                    deckUrl: ['/deck', this.props.PresentationStore.selector.id, this.props.PresentationStore.deckSlug].join('/')
                },
                menu: {
                    deckUrl: ['/deck', this.props.PresentationStore.selector.id, this.props.PresentationStore.deckSlug].join('/'),
                    speakerNotes: '/custom_modules/reveal.js/plugin/notes/notes.html',
                    overview: true,
                    side: 'left',
                    width: 'normal',
                    numbers: false,
                    titleSelector: 'h1, h2, h3, h4, h5, h6',
                    useTextContentForMissingTitles: true,
                    hideMissingTitles: false,
                    markers: true,

                    // Specify custom panels to be included in the menu, by
                    // providing an array of objects with 'title', 'icon'
                    // properties, and either a 'src' or 'content' property.
                    custom: false,

                    // Specifies the themes that will be available in the themes
                    // menu panel. Set to 'true' to show the themes menu panel
                    // with the default themes list. Alternatively, provide an
                    // array to specify the themes to make available in the
                    // themes menu panel, for example...
                    // [
                    //     { name: 'Black', theme: 'css/theme/black.css' },
                    //     { name: 'White', theme: 'css/theme/white.css' },
                    //     { name: 'League', theme: 'css/theme/league.css' }
                    // ]
                    themes: false,

                    themesPath: 'css/theme/',
                    transitions: false,
                    openButton: true,
                    openSlideNumber: false,
                    keyboard: true,
                    sticky: false,
                    autoOpen: true,
                    delayInit: false,
                    openOnInit: false,
                    loadIcons: true
                },
                multiplex: multiplexConfig
            });


            Reveal.addEventListener( 'ready', ( event ) => {
                //$('.accessibilityWrapper').attr('tabindex', '');
                //$('.present > .accessibilityWrapper > .pptx2html div:first-child').focus();
                //console.log($('.present > .accessibilityWrapper > .pptx2html div:first').html());
            	// event.currentSlide, event.indexh, event.indexv
                ChartRender.renderCharts(false);
                this.resize();
            } );

            Reveal.addEventListener( 'slidechanged', ( event ) => {
                //console.log('slidechanged: ' + $('.present > .accessibilityWrapper > .pptx2html div:first').html());
                //$('.present > .accessibilityWrapper > .pptx2html div:first-child').focus();
                //console.log('resize non-pptx2html slide content - presentwidth: ' + presentwidth + ' and height: ' + presentheight);
                ChartRender.renderCharts(true);
                this.resize();
            } );

            //$('.present > .pptx2html div:first').focus();

        //listen to resize event and resize.
        /*ReactDOM.findDOMNode(this.refs.container).addEventListener('resize', (evt) =>
            {
            //console.log('resize');
            this.resize();
        });*/
            window.addEventListener('resize', this.resize());
        }
        //$('.present >  .pptx2html div:first').focus();

        // update mathjax rendering
        // add to the mathjax rendering queue the command to type-set the slide content
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'slides']);

    }
    resize(){
        if(process.env.BROWSER){
            let pptxwidth;
            let pptxheight;
            if( $('.present > .pptx2html').html() ){
                pptxwidth = $('.present > .pptx2html').width();
                pptxheight = $('.present > .pptx2html').height();
            } else {

                pptxwidth = '100%';
                pptxheight = '100%';

                //resize non-pptx2html slide content based on current height of window
                //reimplemented based on old SlideWiki https://github.com/AKSW/SlideWiki/blob/307e9e87aee08543e46d270fe267aeaa5cdbfe3b/slidewiki/static/js/scale.js
                //let presentwidth = $('.present').width();
                let presentheight = $('.present').height();
                //console.log('resize non-pptx2html slide content - presentwidth: ' + presentwidth + ' and height: ' + presentheight);
                //let screenwidth = document.getElementsByClassName('reveal')[0].offsetWidth * 0.85;
                //let screenwidth = document.getElementsByClassName('reveal')[0].offsetWidth * 0.85;
                //let screenheight = (document.getElementsByClassName('reveal')[0].offsetHeight * 0.85);
                let screenheight = document.getElementsByClassName('reveal')[0].offsetHeight;
                //console.log('resize non-pptx2html slide content - screenwidth: ' + screenwidth + ' and height: ' + screenheight);
                let heightratio = screenheight / presentheight ;
                //let widthratio = screenwidth / presentwidth;
                let scaleratio = 1;
                //if (widthratio < heightratio){scaleratio = widthratio;} else {scaleratio = heightratio;}
                if (presentheight > screenheight){scaleratio = heightratio;}
                //console.log('resize non-pptx2html slide content - widthratio: ' + widthratio + ' and heightratioratio: ' + heightratio);
                //console.log('resize non-pptx2html slide content - scaleratio: ' + scaleratio);

                $('.present').css({'transform': '', 'transform-origin': ''});
                $('.present').css({'transform': 'scale('+scaleratio+','+scaleratio+')', 'transform-origin': 'center top'});

            }
            // event.previousSlide, event.currentSlide, event.indexh, event.indexv
            //let state = Reveal.getState();
            //console.log('state: ' + JSON.stringify(state));
            //console.log('slidechanged dimensions: ' + pptxheight + ' by ' + pptxwidth);
            Reveal.configure({
                width: pptxwidth,
                height: pptxheight,
                slideNumber: true
            });

        }
    }

    render(){

        // Load the theme stylesheet
        let styleName = 'default';
        if(this.props.PresentationStore.theme && typeof this.props.PresentationStore.theme !== 'undefined')
            styleName = this.props.PresentationStore.theme;
        if (styleName === '' || typeof styleName === 'undefined' || styleName === 'undefined')//if none of above yield a theme they will be legacy decks:
            styleName = 'white';
        let style = require('../../../custom_modules/reveal.js/css/theme/' + styleName + '.css');
        let slides = this.getSlides();
        return(
            //<ResizeAware ref='container' id='container'>
            <div ref='container' id='container'>
                <div className={['reveal', style.reveal].join(' ')} style={this.playerCss}  ref={(refToDiv) => this.revealDiv = refToDiv} data-transition="none" data-background-transition="none">
                    <div className={['slides', style.slides].join(' ')}>
      			     	     {slides}
        			      </div>
                </div>
                <br style={this.clearStyle} />
            </div>
            //</ResizeAware>
        );
    }

    getSlides(){
        let slides = this.props.PresentationStore.content;

        let html = <section />;
        if(slides){
            html = slides.map((slide) => {
                let content = slide.content.replace(' src=', ' data-src=') + ((slide.speakernotes) ? '<aside class="notes">' + slide.speakernotes + '</aside>' : '');
                let bgTemp = content.split('background-color: ');
                //need to check if bg is provided
                let backgroundColour = bgTemp.length > 1 ? content.split('background-color: ')[1].split(';')[0] : '';
                return <section data-background-color={backgroundColour} dangerouslySetInnerHTML={{__html:content}} id={'slide-' + slide.id} key={slide.id}/>;
            });
        }
        return html;
    }

}

Presentation = connectToStores(Presentation, [PresentationStore], (context, props) => {
    return {
        PresentationStore: context.getStore(PresentationStore).getState()
    };
});
Presentation = handleRoute(Presentation);//NOTE add currentRoute attribute to constructor props

export default Presentation;
