module MathProtect
  PLACEHOLDER = "MATHPROTECTPLACEHOLDER".freeze

  def self.protect(content)
    placeholders = []
    protected_content = content.gsub(/\$\$[\s\S]*?\$\$|\$(?!\s)(?:\\.|[^\n$])+\$/) do |match|
      token = "#{PLACEHOLDER}#{placeholders.length}END"
      placeholders << match
      token
    end
    [protected_content, placeholders]
  end

  def self.restore(content, placeholders)
    placeholders.each_with_index do |math, index|
      content = content.gsub("#{PLACEHOLDER}#{index}END", math)
    end
    content
  end
end

Jekyll::Hooks.register [:pages, :documents], :pre_render do |item|
  protected_content, placeholders = MathProtect.protect(item.content)
  item.content = protected_content
  item.data["math_protect_placeholders"] = placeholders
end

Jekyll::Hooks.register [:pages, :documents], :post_convert do |item|
  placeholders = item.data.delete("math_protect_placeholders")
  next unless placeholders

  if item.output
    item.output = MathProtect.restore(item.output, placeholders)
  else
    item.content = MathProtect.restore(item.content, placeholders)
  end
end
