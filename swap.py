import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import webbrowser
import tempfile

def generate_loremflickr_link(width, height, tags):
    return f"https://loremflickr.com/{width}/{height}/{','.join(tags)}"

def extract_theme(html):
    # Extract keywords/themes based on meta tags, title, or content
    soup = BeautifulSoup(html, "html.parser")
    keywords = soup.find("meta", attrs={"name": "keywords"})
    description = soup.find("meta", attrs={"name": "description"})
    title = soup.title.string if soup.title else ""
    
    tags = []
    if keywords and keywords["content"]:
        tags.extend(keywords["content"].split(","))
    if description and description["content"]:
        tags.extend(description["content"].split())
    if title:
        tags.extend(title.split())
    
    # Simplify tags for loremflickr (remove duplicates, spaces, and irrelevant words)
    tags = list(set([tag.lower().strip() for tag in tags if len(tag) > 2]))
    return tags[:3] if tags else ["default"]  # Limit to 3 tags for loremflickr

def replace_image_links(html, tags):
    soup = BeautifulSoup(html, "html.parser")
    replaced_domains = set()

    for img in soup.find_all("img", src=True):
        original_src = img["src"]
        # Match URLs with image sizes like 800x600 in them
        size_match = re.search(r"(\d+)/(\d+)", original_src)
        if size_match:
            width, height = size_match.groups()
            new_src = generate_loremflickr_link(width, height, tags)
            img["src"] = new_src
            replaced_domains.add(urlparse(original_src).netloc)
    
    return str(soup), replaced_domains

def main():
    url = input("Enter the URL of the webpage: ")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return

    html = response.text
    tags = extract_theme(html)
    updated_html, replaced_domains = replace_image_links(html, tags)
    
    print("Domains of replaced image URLs:")
    for domain in replaced_domains:
        print(f"- {domain}")

    # Save the updated HTML locally and open in browser
    with tempfile.NamedTemporaryFile(delete=False, suffix=".html", mode="w", encoding="utf-8") as temp_file:
        temp_file.write(updated_html)
        temp_file_path = temp_file.name
    
    print(f"Opening the modified page locally: {temp_file_path}")
    webbrowser.open(f"file://{temp_file_path}")

if __name__ == "__main__":
    main()
