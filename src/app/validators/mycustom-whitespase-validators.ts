import { FormControl, ValidationErrors } from '@angular/forms';

export class MycustomWhitespaseValidators {
    // Создаем класс валидатора в нем будет статический метод который возвращает обьект типа ValidationErrors.
    static notOnlyWhitespace(control: FormControl) : ValidationErrors {
        
        // Проверяем содержит ли переданное поле пробелы.
        if ((control.value != null) && (control.value.trim().length === 0)) {

            // Если содержит возвращаем обьект ValidationErrors. 
            // Как видим ValidationErrors возвращает true в шаблоне 'notOnlyWhiteSpace' если нашлись пробелы.
            // Сейчас все поймете по коду компонента и html страницы листайте дальше.
            return { 'notOnlyWhitespace': true };
        }
        else {
            // valid, return null
            return null!;
        }
    }
}
