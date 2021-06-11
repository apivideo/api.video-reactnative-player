import { expect } from 'chai';
import ApiVideoPlayer, { PlayerProps } from '../src/index';

const getEmbedUrlForConfig = (config: PlayerProps) => new ApiVideoPlayer(config).buildEmbedUrl(config);

describe('Embed URL are properly generated', () => {
    it('generate simple urls', () => {
        expect(getEmbedUrlForConfig({videoId: "123456"}))
            .to.equal("https://embed.api.video/vod/123456");
    });

    it('generate simple urls for live', () => {
        expect(getEmbedUrlForConfig({videoId: "123456", type: 'live'}))
            .to.equal("https://embed.api.video/live/123456");
    });

    it('generate urls with fragments', () => {
        expect(getEmbedUrlForConfig({videoId: "123456", hideControls: true, hideTitle: true, autoplay: true, loop: true}))
            .to.equal("https://embed.api.video/vod/123456#hide-controls;hide-title;autoplay;loop");

        expect(getEmbedUrlForConfig({videoId: "123456", hideControls: false, hideTitle: false, autoplay: false, loop: false}))
            .to.equal("https://embed.api.video/vod/123456");
    });

    it('generate urls with muted param', () => {
        expect(getEmbedUrlForConfig({videoId: "123456", muted: true}))
            .to.equal("https://embed.api.video/vod/123456?muted=true");

        expect(getEmbedUrlForConfig({videoId: "123456", muted: false}))
            .to.equal("https://embed.api.video/vod/123456");
    });

    it('generate urls with muted param and fragments', () => {
        expect(getEmbedUrlForConfig({videoId: "123456", hideControls: true, hideTitle: true, muted: true}))
            .to.equal("https://embed.api.video/vod/123456?muted=true#hide-controls;hide-title");
    });
});
