import {Component, effect, resource, signal, ResourceStatus, computed} from '@angular/core';
import {API_URL} from './config';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {User} from './model';

type TRequest = {
  query: string
}

@Component({
  selector: 'app-user-search',
  imports: [MatProgressBarModule],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.scss',
  standalone: true
})
export class UserSearchComponent {
  query = signal('');
  users = resource<User[], TRequest>({
    // loader: () => {
    //   return fetch(`${API_URL}`).then((data) => data.json())
    // },
    loader: async ({request, abortSignal}) => {
      // request содержит в себе то, что мы вернули в текущем ресурсе в поле request
      // const users = await fetch(`${API_URL}?name_like=^${request.query}`, {
      //   signal: abortSignal
      // });
      // можем сделать кастомный аборт сигнал: (slow 3G)
      const customAbortCtrl = new AbortController();
      setTimeout(() => customAbortCtrl.abort(`Too long response...`), 500);
      const users = await fetch(`${API_URL}?name_like=^${request.query}`, {
        signal: customAbortCtrl.signal
      });
      //
      // если в fetch приходит 4** или 5** статус код,
      // он не считает это ошибкой и в resource
      // не прокидывается  users.errors(), поэтому сделаем это сами
      if (!users.ok) throw Error(`Could not fetch...`)
      return users.json();
    },
    request: (): TRequest => {
      // при изменении сигнала this.query()
      // будет вызываться loader для ресурса
      // users и будут обновляться данные
      return {query: this.query()}
      // можно вернуть просто сигнал, можно объект с сигналами
    }
  });
  // для загрузки такое реализовывать не нужно,
  // уже есть в самом resource: this.users.isLoading()
  // isLoading = computed(() => {
  //   return this.users.status() === ResourceStatus.Loading
  //     || this.users.status() === ResourceStatus.Reloading
  // })

  constructor() {
    effect(() => {
      console.log(`Status: ${this.users.status()}`);
      // console.log('Enum with statuses from Angular: ', ResourceStatus)
    })
  }

  addUser() {
    const userId = this.users.value()?.length ? 123 + this.users.value()!.length : 123;
    const user: User = { id: userId, name: "Dmytro Mezhenskyi" };
    this.users.update((users) => users ? [user, ...users] : [user])
  }
}

