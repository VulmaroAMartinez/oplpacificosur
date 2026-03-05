import { useBlockProps, RichText, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
    const { subtitle, title, description } = attributes;
    const blockProps = useBlockProps({ className: 'py-24 bg-slate-50' });

    const TEMPLATE = [
        ['corporate/service-card', { iconName: 'ship', title: 'Transporte Marítimo', description: 'Servicios FCL y LCL a los principales puertos...' }],
        ['corporate/service-card', { iconName: 'sailboat', title: 'Servicios de lanchaje', description: 'Transporte seguro y especializado...' }],
        ['corporate/service-card', { iconName: 'package', title: 'Carga y descarga', description: 'Carga y descarga de mercancías...' }],
        ['corporate/service-card', { iconName: 'shield', title: 'Agencia Naviera', description: 'Gestión experta de trámites aduaneros.' }],
        ['corporate/service-card', { iconName: 'globe', title: 'Avituallamiento de Buques', description: 'Atención a naves, avituallamiento...' }],
        ['corporate/service-card', { iconName: 'anchor', title: 'Amarre y desamarre', description: 'Aseguramos la inmovilización de barcos...' }]
    ];

    // Le pasamos las clases del Grid de Tailwind directo al motor de Gutenberg
    const innerBlocksProps = useInnerBlocksProps(
        { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" },
        { allowedBlocks: ['corporate/service-card'], template: TEMPLATE }
    );

    return (
        <section {...blockProps}>
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <RichText tagName="span" className="text-orange-500 font-bold tracking-widest uppercase text-sm" value={subtitle} onChange={(val) => setAttributes({ subtitle: val })} />
                    <RichText tagName="h2" className="text-4xl font-bold text-slate-900 mt-2 mb-4" value={title} onChange={(val) => setAttributes({ title: val })} />
                    <RichText tagName="p" className="text-slate-600" value={description} onChange={(val) => setAttributes({ description: val })} />
                </div>

                {/* Gutenberg renderizará el contenedor mágico aquí */}
                <div {...innerBlocksProps} />
            </div>
        </section>
    );
}