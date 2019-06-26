import Smooch from 'smooch'
import ko from 'knockout'
import textMzTemplate from '../templates/textMz.html'

class textMzViewModel {
  constructor(params) {
    const self = this

      self.message = params.message;
      self.bot = params.bot
      console.log(self.message);
      self.title  = ko.observable("");
      self.body  = ko.observable("");

      try {
          var items =  self.message.body.split("@+@");
          self.title(items[0] + '练习');
          self.body(items[1]);
          console.log(self.title());
      }catch (e) {
      }



      self.clickOnList = async function (_data, event) {

          console.log(_data);
          await self.bot.appendQuestion(_data.text)
          //
          Smooch.triggerPostback(_data._id)
      }


  }


}

ko.components.register('text-mz', {
  viewModel: textMzViewModel,
  template: textMzTemplate
})
