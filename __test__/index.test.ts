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
            .to.equal("https://embed.api.video/vod/123456?muted=true&");

        expect(getEmbedUrlForConfig({videoId: "123456", muted: false}))
            .to.equal("https://embed.api.video/vod/123456");
    });

    it('generate urls with muted param and fragments', () => {
        expect(getEmbedUrlForConfig({videoId: "123456", hideControls: true, hideTitle: true, muted: true}))
            .to.equal("https://embed.api.video/vod/123456?muted=true&#hide-controls;hide-title");
    });

    it('generate urls with private video token', () => {
        expect(getEmbedUrlForConfig({videoId: "123456", hideControls: true, hideTitle: true, privateToken: '5e719f3a-8a38-48ab-a707-3803ada59108'}))
            .to.equal("https://embed.api.video/vod/123456?token=5e719f3a-8a38-48ab-a707-3803ada59108&#hide-controls;hide-title");
    });

    it('generate urls with private video token and muted', () => {
        expect(getEmbedUrlForConfig({videoId: "123456", hideControls: true, hideTitle: true, privateToken: '5e719f3a-8a38-48ab-a707-3803ada59108', muted: true}))
            .to.equal("https://embed.api.video/vod/123456?token=5e719f3a-8a38-48ab-a707-3803ada59108&muted=true&#hide-controls;hide-title");
    });

    it('generate urls with private video token and session token', () => {
        expect(getEmbedUrlForConfig({videoId: "123456", hideControls: true, hideTitle: true, privateToken: '5e719f3a-8a38-48ab-a707-3803ada59108', sessionToken: "79c04b34-f625-4f59-ad8f-d11edd6a53b7"}))
            .to.equal("https://embed.api.video/vod/123456?token=5e719f3a-8a38-48ab-a707-3803ada59108&avh=79c04b34-f625-4f59-ad8f-d11edd6a53b7&#hide-controls;hide-title");
    });

});
