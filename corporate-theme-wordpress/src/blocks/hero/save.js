import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { bgImageUrl, subtitle, titleStart, titleHighlight, description, ctaQuoteText, ctaQuoteUrl, ctaServicesText, ctaServicesUrl } = attributes;
    const blockProps = useBlockProps.save({ className: 'relative h-screen min-h-[600px] flex items-center' });

    return (
        <section {...blockProps}>
            <div className="absolute inset-0 z-0">
                {bgImageUrl && (
                    <img src={bgImageUrl} alt="Fondo Hero" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-8 relative z-10 pt-20">
                {/* Usamos una animación CSS nativa en lugar de Framer Motion */}
                <div className="max-w-2xl text-white animate-fade-in-left">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-12 bg-orange-500" />
                        <RichText.Content tagName="span" className="uppercase tracking-widest text-sm font-semibold text-orange-400" value={subtitle} />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                        <RichText.Content tagName="span" value={titleStart} />
                        <br />
                        <RichText.Content tagName="span" className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600" value={titleHighlight} />
                    </h1>

                    <RichText.Content tagName="p" className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed" value={description} />

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href={ctaQuoteUrl} className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-sm transition-all flex items-center justify-center gap-2 group">
                            <RichText.Content tagName="span" value={ctaQuoteText} />
                            <svg className="group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </a>
                        <a href={ctaServicesUrl} className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-sm hover:bg-white hover:text-slate-900 transition-all text-center">
                            <RichText.Content tagName="span" value={ctaServicesText} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}