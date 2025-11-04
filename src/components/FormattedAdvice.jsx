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
      <div className="text-center py-8">
        <p className="text-sm text-gray-400">No advice available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {formattedContent.map((section, index) => {
        if (section.type === 'heading') {
          return (
            <div key={index} className="mt-8 first:mt-0">
              <h4 className={`font-bold text-white mb-4 ${
                section.level === 2 ? 'text-2xl' : 'text-xl'
              }`}>
                {section.content}
              </h4>
            </div>
          );
        }

        if (section.type === 'list') {
          return (
            <ul key={index} className="space-y-3 ml-2">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 leading-relaxed text-base">{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <div key={index} className="space-y-3">
            {section.content.map((para, paraIndex) => (
              <p key={paraIndex} className="text-gray-300 leading-relaxed text-base">
                {para}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
