import React from 'react';

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqProps = {
  items: FaqItem[];
  title?: string;
};

/**
 * Reusable FAQ component that displays a list of questions and answers
 */
export function FAQ({ items, title = 'Preguntas Frecuentes' }: FaqProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
      )}
      <div className="space-y-4">
        {items.map((faq, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold mb-2">{faq.question}</h4>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
