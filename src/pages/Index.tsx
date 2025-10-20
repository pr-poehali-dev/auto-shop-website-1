import { useState, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

type CartItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
};

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

const Index = () => {
  const [date, setDate] = useState<Date>();
  const [showBooking, setShowBooking] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Добавлено в корзину",
      description: product.name,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const cartContextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
    setShowBooking(false);
  };

  const services = [
    { icon: 'Wrench', title: 'Диагностика', description: 'Компьютерная диагностика всех систем автомобиля' },
    { icon: 'Settings', title: 'Ремонт', description: 'Профессиональный ремонт любой сложности' },
    { icon: 'Droplet', title: 'Замена масла', description: 'Быстрая замена масла и фильтров' },
    { icon: 'Zap', title: 'Электрика', description: 'Ремонт электрооборудования и проводки' },
    { icon: 'Gauge', title: 'Шиномонтаж', description: 'Шиномонтаж, балансировка, хранение' },
    { icon: 'Shield', title: 'ТО', description: 'Техническое обслуживание по регламенту' },
  ];

  const products: Product[] = [
    { id: 1, name: 'Масло моторное синтетическое 5W-40', price: 2500, category: 'Масла', image: '🛢️', inStock: true },
    { id: 2, name: 'Фильтр масляный', price: 450, category: 'Фильтры', image: '⚙️', inStock: true },
    { id: 3, name: 'Фильтр воздушный', price: 650, category: 'Фильтры', image: '🌀', inStock: true },
    { id: 4, name: 'Колодки тормозные передние', price: 3200, category: 'Тормоза', image: '🔴', inStock: true },
    { id: 5, name: 'Колодки тормозные задние', price: 2800, category: 'Тормоза', image: '🔴', inStock: true },
    { id: 6, name: 'Диск тормозной передний (пара)', price: 4500, category: 'Тормоза', image: '💿', inStock: true },
    { id: 7, name: 'Свечи зажигания (комплект)', price: 1200, category: 'Зажигание', image: '⚡', inStock: true },
    { id: 8, name: 'Аккумулятор 60Ah', price: 5500, category: 'Электрика', image: '🔋', inStock: true },
    { id: 9, name: 'Лампа H7 (2 шт)', price: 350, category: 'Электрика', image: '💡', inStock: true },
    { id: 10, name: 'Антифриз красный 5л', price: 800, category: 'Жидкости', image: '🧪', inStock: true },
    { id: 11, name: 'Омывайка летняя 5л', price: 200, category: 'Жидкости', image: '💧', inStock: true },
    { id: 12, name: 'Щётки стеклоочистителя (пара)', price: 950, category: 'Стеклоочистители', image: '🧹', inStock: true },
  ];

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <CartContext.Provider value={cartContextValue}>
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Car" className="text-primary-foreground" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              АвтоМастер
            </h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Услуги</a>
            <a href="#catalog" className="text-muted-foreground hover:text-foreground transition-colors">Каталог</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">О нас</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Контакты</a>
          </nav>
          <div className="flex gap-2">
            <Button onClick={() => setShowCart(true)} variant="outline" className="relative">
              <Icon name="ShoppingCart" size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
            <Button onClick={() => setShowBooking(true)} className="bg-primary hover:bg-primary/90">
              <Icon name="Calendar" className="mr-2" size={16} />
              Записаться
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(14,165,233,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Icon name="MapPin" size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">г. Анжеро-Судженск, Кемеровская область</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Профессиональный
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> автосервис </span>
              и магазин запчастей
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Качественный ремонт, диагностика и обслуживание вашего автомобиля. 
              Оригинальные запчасти и профессиональные мастера.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setShowBooking(true)} className="bg-primary hover:bg-primary/90 text-lg px-8">
                <Icon name="Calendar" className="mr-2" size={20} />
                Записаться на сервис
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:bg-primary/10">
                <Icon name="Phone" className="mr-2" size={20} />
                +7 (123) 456-78-90
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Наши услуги</h3>
            <p className="text-muted-foreground text-lg">Полный спектр услуг для вашего автомобиля</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon name={service.icon as any} className="text-primary" size={28} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Каталог запчастей</h3>
            <p className="text-muted-foreground text-lg">Оригинальные запчасти и расходные материалы</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={selectedCategory === 'all' ? 'bg-primary' : ''}
            >
              Все товары
            </Button>
            {categories.filter(c => c !== 'all').map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={selectedCategory === category ? 'bg-primary' : ''}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
                <CardHeader>
                  <div className="text-6xl mb-4 text-center">{product.image}</div>
                  <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">{product.name}</CardTitle>
                  <CardDescription className="text-sm">{product.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">{product.price} ₽</div>
                    {product.inStock && (
                      <div className="flex items-center gap-1 text-xs text-green-500">
                        <Icon name="CheckCircle2" size={14} />
                        <span>В наличии</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Icon name="ShoppingCart" className="mr-2" size={16} />
                    В корзину
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">О нашем автосервисе</h3>
              <p className="text-muted-foreground text-lg mb-6">
                АвтоМастер — это современный автосервис в г. Анжеро-Судженск, Кемеровской области. 
                Мы предлагаем полный комплекс услуг по обслуживанию и ремонту автомобилей любых марок.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="CheckCircle2" className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Опытные мастера</h4>
                    <p className="text-muted-foreground">Сертифицированные специалисты с многолетним опытом работы</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="CheckCircle2" className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Оригинальные запчасти</h4>
                    <p className="text-muted-foreground">Только качественные запчасти от проверенных поставщиков</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="CheckCircle2" className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Современное оборудование</h4>
                    <p className="text-muted-foreground">Новейшее диагностическое и ремонтное оборудование</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 p-6">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-muted-foreground">Довольных клиентов</div>
              </Card>
              <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20 p-6">
                <div className="text-4xl font-bold text-secondary mb-2">15+</div>
                <div className="text-muted-foreground">Лет на рынке</div>
              </Card>
              <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 p-6">
                <div className="text-4xl font-bold text-primary mb-2">5000+</div>
                <div className="text-muted-foreground">Выполненных работ</div>
              </Card>
              <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20 p-6">
                <div className="text-4xl font-bold text-secondary mb-2">24/7</div>
                <div className="text-muted-foreground">Поддержка клиентов</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Контакты</h3>
              <p className="text-muted-foreground text-lg">Мы всегда рады вам помочь</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border/50 p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="MapPin" className="text-primary" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Адрес</h4>
                <p className="text-muted-foreground">г. Анжеро-Судженск, Кемеровская область</p>
              </Card>
              <Card className="bg-card border-border/50 p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Phone" className="text-primary" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Телефон</h4>
                <p className="text-muted-foreground">+7 (123) 456-78-90</p>
              </Card>
              <Card className="bg-card border-border/50 p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Clock" className="text-primary" size={24} />
                </div>
                <h4 className="font-semibold mb-2">Режим работы</h4>
                <p className="text-muted-foreground">Пн-Пт: 9:00 - 18:00<br />Сб-Вс: 10:00 - 16:00</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Car" className="text-primary-foreground" size={18} />
              </div>
              <span className="font-semibold">АвтоМастер</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2024 АвтоМастер. Все права защищены.</p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Phone" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Mail" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {showBooking && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Запись на сервис</CardTitle>
                  <CardDescription>Заполните форму и мы свяжемся с вами для подтверждения</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowBooking(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input id="name" placeholder="Ваше имя" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" type="tel" placeholder="+7 (___) ___-__-__" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="car">Марка и модель автомобиля</Label>
                  <Input id="car" placeholder="Например: Toyota Camry" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Тип услуги</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service, index) => (
                        <SelectItem key={index} value={service.title.toLowerCase()}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Дата</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Icon name="Calendar" className="mr-2" size={16} />
                          {date ? format(date, 'PPP', { locale: ru }) : 'Выберите дату'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          locale={ru}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Время</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите время" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий</Label>
                  <Textarea id="comment" placeholder="Опишите проблему или пожелания" rows={4} />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    <Icon name="Send" className="mr-2" size={16} />
                    Отправить заявку
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowBooking(false)}>
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Корзина</CardTitle>
                  <CardDescription>
                    {getTotalItems() > 0 ? `Товаров: ${getTotalItems()}` : 'Корзина пуста'}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="ShoppingCart" className="mx-auto mb-4 text-muted-foreground" size={64} />
                  <p className="text-muted-foreground text-lg">Корзина пуста</p>
                  <Button 
                    onClick={() => {
                      setShowCart(false);
                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-4"
                  >
                    Перейти к каталогу
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{item.image}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            <p className="text-primary font-bold mt-1">{item.price} ₽</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Icon name="Minus" size={16} />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                              className="ml-2 text-destructive"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">Итого:</span>
                      <span className="text-2xl font-bold text-primary">{getTotalPrice()} ₽</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cart-name">Имя</Label>
                      <Input id="cart-name" placeholder="Ваше имя" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cart-phone">Телефон</Label>
                      <Input id="cart-phone" type="tel" placeholder="+7 (___) ___-__-__" />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => {
                          toast({
                            title: "Заказ оформлен!",
                            description: "Мы свяжемся с вами для подтверждения заказа.",
                          });
                          setCart([]);
                          setShowCart(false);
                        }}
                      >
                        <Icon name="ShoppingBag" className="mr-2" size={16} />
                        Оформить заказ
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCart(false)}
                      >
                        Продолжить покупки
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </CartContext.Provider>
  );
};

export default Index;