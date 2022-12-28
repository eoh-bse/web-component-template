function html(strings: TemplateStringsArray): HTMLTemplateElement {
  if (strings.length > 1)
    throw new Error("Interpolating values into HTML is not allowed");

  const template = document.createElement("template");
  template.innerHTML = strings[0];

  return template;
}

export { html };
