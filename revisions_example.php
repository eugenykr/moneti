<?php

/** revisions **/
function get_manifest() {

    $manifest_path = ABSPATH.'/assets/rev/rev-manifest.json';
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), TRUE);
    } else {
        $manifest = array();
    }

    return $manifest;
}

function get_rev_filename($filename) {

    $manifest = get_manifest();
    if (array_key_exists($filename, $manifest)) {
        return $manifest[$filename];
    }

    return $filename;
}

function get_styles_link() {
    $styles_rev =  URLROOT.'/assets/rev/'.get_rev_filename('bundle.css');
    return $styles_rev;
}

function get_scripts_link() {
    $scripts_rev =  URLROOT.'/assets/rev/'.get_rev_filename('bundle.js');
    return $scripts_rev;
}