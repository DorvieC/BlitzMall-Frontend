export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Електроніка',
    subcategories: ['Смартфони', 'Ноутбуки', 'Навушники', 'Телевізори', 'Побутова техніка'],
  },
  {
    id: 'home-kitchen',
    name: 'Дім і кухня',
    subcategories: ['Кухонне приладдя', 'Текстиль', 'Меблі', 'Декор'],
  },
  {
    id: 'clothing',
    name: 'Одяг і взуття',
    subcategories: ['Жіночий одяг', 'Чоловічий одяг', 'Взуття', 'Аксесуари'],
  },
  {
    id: 'beauty',
    name: "Краса і здоров'я",
    subcategories: ['Косметика', 'Догляд за шкірою', 'Парфумерія', 'Вітаміни'],
  },
  {
    id: 'sport',
    name: 'Спорт і відпочинок',
    subcategories: ['Тренажери', 'Спортивний одяг', 'Туризм', 'Велоспорт'],
  },
  {
    id: 'kids',
    name: 'Дитячі товари',
    subcategories: ['Іграшки', 'Дитячий одяг', 'Коляски', 'Годування'],
  },
  {
    id: 'pets',
    name: 'Зоотовари',
    subcategories: ['Корми', 'Іграшки для тварин', 'Аксесуари'],
  },
];

export const ALL_CATEGORIES: Category = {
  id: 'all',
  name: 'Усі категорії',
  subcategories: CATEGORIES.map((cat) => cat.name),
};
