<?php
// 1. Registrar bloques compilados por React
function corporate_register_blocks() {
    register_block_type( __DIR__ . '/build/blocks/hero' );
    register_block_type( __DIR__ . '/build/blocks/services' );
    register_block_type( __DIR__ . '/build/blocks/service-card' );
}
add_action( 'init', 'corporate_register_blocks' );

// 2. Cargar Tailwind en el Frontend (Para los visitantes)
function corporate_enqueue_styles() {
    // Añadimos filemtime para romper el caché automáticamente al guardar cambios
    $css_path = get_template_directory() . '/src/output.css';
    $css_uri  = get_template_directory_uri() . '/src/output.css';
    $version  = file_exists( $css_path ) ? filemtime( $css_path ) : time();

    wp_enqueue_style( 'corporate-style', $css_uri, [], $version );
    wp_enqueue_script( 'corporate-header-js', get_template_directory_uri() . '/src/js/header-scroll.js', [], $version, true );
}
add_action( 'wp_enqueue_scripts', 'corporate_enqueue_styles' );

// 3. Cargar Tailwind DENTRO del iframe del Editor FSE (La clave mágica)
function corporate_editor_styles() {
    add_theme_support( 'editor-styles' );
    // add_editor_style lee rutas relativas desde la raíz del tema
    add_editor_style( 'src/output.css' );
}
add_action( 'after_setup_theme', 'corporate_editor_styles' );