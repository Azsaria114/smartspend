import { useMemo } from 'react';

export default function FormattedAdvice({ advice }) {
  const formattedContent = useMemo(() => {
    if (!advice) return null;

    // Split by lines and process
    const lines = advice.split('\n').filter(line => line.trim());
    const sections = [];
    let currentSection = { type: 'paragraph', content: [] };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Headers (### or **)
      if (trimmed.startsWith('###')) {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        currentSection = {
          type: 'heading',
          content: trimmed.replace(/^###+\s*/, '').replace(/\*\*/g, ''),
          level: 3
        };
        sections.push(currentSection);
        currentSection = { type: 'paragraph', content: [] };
      }
      // Bold headers (**text**)
      else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        currentSection = {
          type: 'heading',
          content: trimmed.replace(/\*\*/g, ''),
          level: 2
        };
        sections.push(currentSection);
        currentSection = { type: 'paragraph', content: [] };
      }
      // Bullet points or numbered lists
      else if (trimmed.match(/^[\d\-•]\s+/) || trimmed.startsWith('-') || trimmed.startsWith('•')) {
        if (currentSection.type !== 'list') {
          if (currentSection.content.length > 0) {
            sections.push(currentSection);
          }
          currentSection = { type: 'list', content: [] };
        }
        const itemText = trimmed.replace(/^[\d\-•]\s+/, '').replace(/\*\*/g, '');
        currentSection.content.push(itemText);
      }
      // Regular paragraph
      else {
        const cleaned = trimmed.replace(/\*\*/g, '');
        if (cleaned.length > 0) {
          currentSection.content.push(cleaned);
        }
      }

      // Push last section
      if (index === lines.length - 1 && currentSection.content.length > 0) {
        sections.push(currentSection);
      }
    });

    return sections;
  }, [advice]);

  if (!formattedContent || formattedContent.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No advice available</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {formattedContent.map((section, index) => {
        if (section.type === 'heading') {
          return (
            <div key={index} className="mt-6 first:mt-0">
              <h4 className={`font-bold text-gray-900 mb-3 ${
                section.level === 2 ? 'text-xl' : 'text-lg'
              }`}>
                {section.content}
              </h4>
            </div>
          );
        }

        if (section.type === 'list') {
          return (
            <ul key={index} className="space-y-2 ml-4">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <span className="text-indigo-600 mt-1.5 flex-shrink-0">•</span>
                  <span className="text-gray-800 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div key={index} className="space-y-2">
            {section.content.map((para, paraIndex) => (
              <p key={paraIndex} className="text-gray-800 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

