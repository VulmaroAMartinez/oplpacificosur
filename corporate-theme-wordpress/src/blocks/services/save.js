import { useBlockProps, RichText, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { subtitle, title, description } = attributes;
    const blockProps = useBlockProps.save({ className: 'py-24 bg-slate-50' });

    const innerBlocksProps = useInnerBlocksProps.save({
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    });

    return (
        <section {...blockProps}>
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <RichText.Content tagName="span" className="text-orange-500 font-bold tracking-widest uppercase text-sm" value={subtitle} />
                    <RichText.Content tagName="h2" className="text-4xl font-bold text-slate-900 mt-2 mb-4" value={title} />
                    <RichText.Content tagName="p" className="text-slate-600" value={description} />
                </div>

                {/* El grid perfecto en el HTML estático */}
                <div {...innerBlocksProps} />
            </div>
        </section>
    );
}