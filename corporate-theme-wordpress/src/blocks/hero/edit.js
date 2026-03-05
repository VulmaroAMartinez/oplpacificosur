import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, MediaUpload, MediaUploadCheck, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { bgImageUrl, bgImageId, subtitle, titleStart, titleHighlight, description, ctaQuoteText, ctaQuoteUrl, ctaServicesText, ctaServicesUrl } = attributes;
    const blockProps = useBlockProps({ className: 'relative h-screen min-h-[600px] flex items-center' });

    const onSelectImage = (media) => {
        setAttributes({ bgImageUrl: media.url, bgImageId: media.id });
    };

    return (
        <>
            {/* Controles en la barra lateral derecha */}
            <InspectorControls>
                <PanelBody title="Enlaces de Botones">
                    <TextControl label="URL Solicitar Cotización" value={ctaQuoteUrl} onChange={(val) => setAttributes({ ctaQuoteUrl: val })} />
                    <TextControl label="URL Nuestros Servicios" value={ctaServicesUrl} onChange={(val) => setAttributes({ ctaServicesUrl: val })} />
                </PanelBody>
            </InspectorControls>

            {/* Controles flotantes encima del bloque */}
            <BlockControls>
                <ToolbarGroup>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            value={bgImageId}
                            render={({ open }) => (
                                <ToolbarButton onClick={open}>Cambiar Imagen de Fondo</ToolbarButton>
                            )}
                        />
                    </MediaUploadCheck>
                </ToolbarGroup>
            </BlockControls>

            {/* La vista del Editor (Tu JSX adaptado) */}
            <section {...blockProps}>
                <div className="absolute inset-0 z-0">
                    {bgImageUrl ? (
                        <img src={bgImageUrl} alt="Fondo Hero" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">Haz clic en "Cambiar Imagen de Fondo" arriba</div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
                </div>

                <div className="container mx-auto px-4 md:px-8 relative z-10 pt-20">
                    <div className="max-w-2xl text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-12 bg-orange-500" />
                            <RichText
                                tagName="span"
                                className="uppercase tracking-widest text-sm font-semibold text-orange-400"
                                value={subtitle}
                                onChange={(val) => setAttributes({ subtitle: val })}
                                placeholder="Subtítulo..."
                            />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            <RichText tagName="span" value={titleStart} onChange={(val) => setAttributes({ titleStart: val })} placeholder="Inicio del título..." />
                            <br />
                            <RichText tagName="span" className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600" value={titleHighlight} onChange={(val) => setAttributes({ titleHighlight: val })} placeholder="Texto resaltado..." />
                        </h1>

                        <RichText tagName="p" className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed" value={description} onChange={(val) => setAttributes({ description: val })} placeholder="Descripción..." />

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="px-8 py-4 bg-orange-500 text-white font-bold rounded-sm flex items-center justify-center gap-2">
                                <RichText tagName="span" value={ctaQuoteText} onChange={(val) => setAttributes({ ctaQuoteText: val })} placeholder="Texto botón 1..." />
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </div>
                            <div className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-sm text-center">
                                <RichText tagName="span" value={ctaServicesText} onChange={(val) => setAttributes({ ctaServicesText: val })} placeholder="Texto botón 2..." />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}