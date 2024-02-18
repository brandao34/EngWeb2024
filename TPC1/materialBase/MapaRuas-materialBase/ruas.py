import os
import xml.etree.ElementTree as ET
import re

def is_valid_xml(xml_string):
    try:
        ET.fromstring(xml_string)
        return True
    except ET.ParseError:
        return False


def is_valid_xml_file(file_path):
    try:
        with open(file_path, 'r') as file:
            xml_string = file.read()
            return is_valid_xml(xml_string)
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
        return False


def extract_text_with_tags(element):
    text = ''.join(element.itertext())
    return text.strip() if text else ''


def process_casa_element(elem):
    num = elem.find('número').text if elem.find('número') is not None else ''
    ent = elem.find('enfiteuta').text if elem.find('enfiteuta') is not None else ''
    foro = elem.find('foro').text if elem.find('foro') is not None else ''
    desc = extract_text_with_tags(elem.find('desc')) if elem.find('desc') is not None else ''
    return f'''
        <li>Casa:
            <ul>
                <li>Número: {num}</li>
                <li>Enfiteuta: {ent}</li>
                <li>Foro: {foro}</li>
                <li>Desc: {desc}</li>
            </ul>
        </li>
    '''


def process_figura_element(elem):
    pth = elem.find('imagem').attrib['path']
    lgd = elem.find('legenda').text
    return f'''
        <div class="figure">
            <img src="{pth}" alt="{lgd}" style="width: {50}%; height: auto;">
            <figcaption>{lgd}</figcaption>
        </div>
    '''


def process_para_elements(root):
    all_para_text = []
    for element in root.iter():
        if element.tag == 'lista-casas':
            break
        if element.tag == 'para':
            para_text = extract_text_with_tags(element)
            all_para_text.append(para_text)
    return [f'<p>{text}</p>' for text in all_para_text]


def process_xml_file(file_path, template):
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()

        rua = root.find(".//meta/nome").text
        numero = root.find(".//meta/número").text
        path = rua.replace(" ", "")
        with open(f"html/{path}.html", "w") as ficheiroRua:
            templateRua = template
            templateRua += f"<h1>Número: {numero}</h1>"
            templateRua += f"<h2>Nome: {rua}</h2>"

            imagem_path = root.findall(".//figura")
            for elem in imagem_path:
                templateRua += process_figura_element(elem)

            templateRua += ''.join(process_para_elements(root))

            templateRua += "<h3>Lista de Casas</h3><ul>"
            casa_path = root.findall(".//casa")
            templateRua += ''.join(process_casa_element(elem) for elem in casa_path)
            templateRua += "</ul></body>"

            ficheiroRua.write(templateRua)

    except ET.ParseError:
        print(f"Error parsing XML file: {file_path}")


def parse_xml():
    template = """<!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <title>Mapa</title>
        <meta charset="utf-8">
    </head>
    <body>
    """

    folder_path = '/home/cid34senhas/Desktop/EngWeb/TPC1/materialBase/MapaRuas-materialBase/texto/'
    xml_files = sorted([f for f in os.listdir(folder_path) if f.endswith('.xml')])

    for filename in xml_files:
        file_path = os.path.join(folder_path, filename)
        if is_valid_xml_file(file_path):
            process_xml_file(file_path, template)

    generate_html_index(xml_files)


def generate_html_index(xml_files):
    html = "<ol>"
    for filename in xml_files:
        path = re.sub(r'MRB-\d{2}-', '', filename.replace(".xml", ""))
        html += f'<li><a href="html/{path}.html">{path}</a></li>'
    html += "</ol></body>"
    
    with open("ruas.html", "w", encoding="utf-8") as ficheiroHtml:
        ficheiroHtml.write(html)


def main():
    parse_xml()


if __name__ == '__main__':
    main()
