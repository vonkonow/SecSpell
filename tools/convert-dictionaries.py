#!/usr/bin/env python3
"""
Convert Hunspell dictionary files (.aff and .dic) to JavaScript files
with base64-encoded content. This allows loading dictionaries without CORS issues.
"""
import base64
import os

def convert_dictionary(aff_path, dic_path, locale, output_dir='.'):
    """Convert .aff and .dic files to a JavaScript file."""
    
    # Read the files as binary (they might contain non-UTF-8 characters)
    with open(aff_path, 'rb') as f:
        aff_content = f.read()
    
    with open(dic_path, 'rb') as f:
        dic_content = f.read()
    
    # Encode to base64
    aff_b64 = base64.b64encode(aff_content).decode('ascii')
    dic_b64 = base64.b64encode(dic_content).decode('ascii')
    
    # Create JavaScript content
    js_var_name = f"dictionary_{locale.replace('-', '_')}"
    js_content = f"""// Dictionary data for {locale}
// Generated from .aff and .dic files
// This file contains base64-encoded dictionary data that will be decoded in memory

window.{js_var_name} = {{
    aff: "{aff_b64}",
    dic: "{dic_b64}"
}};"""
    
    # Write to file
    output_path = os.path.join(output_dir, f"dictionaries-{locale.replace('-', '_')}.js")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    # Calculate sizes
    aff_size_kb = len(aff_content) / 1024
    dic_size_kb = len(dic_content) / 1024
    js_size_kb = len(js_content.encode('utf-8')) / 1024
    
    print(f"[OK] Converted {locale}")
    print(f"  .aff: {aff_size_kb:.2f} KB -> base64: {len(aff_b64) / 1024:.2f} KB")
    print(f"  .dic: {dic_size_kb:.2f} KB -> base64: {len(dic_b64) / 1024:.2f} KB")
    print(f"  Total JS file: {js_size_kb:.2f} KB")
    print(f"  Saved to: {output_path}")
    print()
    
    return output_path

if __name__ == '__main__':
    # Convert English dictionary
    if os.path.exists('dictionaries/en_US.aff') and os.path.exists('dictionaries/en_US.dic'):
        convert_dictionary('dictionaries/en_US.aff', 'dictionaries/en_US.dic', 'en_US')
    else:
        print("[WARNING] English dictionary files not found in dictionaries/ folder")
    
    # Convert Swedish dictionary
    if os.path.exists('dictionaries/sv_SE.aff') and os.path.exists('dictionaries/sv_SE.dic'):
        convert_dictionary('dictionaries/sv_SE.aff', 'dictionaries/sv_SE.dic', 'sv_SE')
    else:
        print("[WARNING] Swedish dictionary files not found in dictionaries/ folder")
    
    print("Done! Now uncomment the script tags in spell.html to use these dictionaries.")

