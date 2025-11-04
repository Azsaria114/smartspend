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
    <div className="space-y-3">
      {formattedContent.map((section, index) => {
        if (section.type === 'heading') {
          return (
            <div key={index} className="mt-4 first:mt-0 relative">
              {/* Timeline dot */}
              <div className="absolute -left-[26px] top-1 w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full border-2 border-gray-800 shadow-lg"></div>
              <h4 className={`font-semibold text-white mb-1.5 ${
                section.level === 2 ? 'text-base' : 'text-sm'
              }`}>
                {section.content}
              </h4>
            </div>
          );
        }

        if (section.type === 'list') {
          return (
            <div key={index} className="space-y-2 ml-1">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-2.5">
                  <div className="mt-1.5 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-sm flex-1">{item}</p>
                </div>
              ))}
            </div>
          );
        }

        return (
          <div key={index} className="space-y-2">
            {section.content.map((para, paraIndex) => (
              <p key={paraIndex} className="text-gray-300 leading-relaxed text-sm">
                {para}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}
