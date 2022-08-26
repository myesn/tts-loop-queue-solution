/** Text-to-Speech 封装（https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis） */
export class TTSPlayer {
  /** SpeechSynthesisUtterance 接口代表一个语音请求，它包含语音服务应阅读的内容以及有关如何阅读的信息（例如语言、音高和音量），包含与（必须通过 init() 初始化） */
  private speechSynthesisUtterance!: SpeechSynthesisUtterance;
  /** 语音的语速(0.1-10)，默认值为 1 */
  private pitch = 1;
  /** 语音的高低音(0-2)，默认值为 0.8 */
  private rate = 0.8;
  /** 是否已完成朗读前的准备工作 */
  private isReadyToSpeak = false;

  /** 开始朗读（默认在清空话语队列后朗读） */
  async speak(text: string, cancelQueue = true) {
    if (!this.isReadyToSpeak) {
      await this.init();
    }

    // 在朗读前清空话语队列
    if (cancelQueue) {
      this.cancel();
    }

    this.speechSynthesisUtterance.text = text;
    speechSynthesis.speak(this.speechSynthesisUtterance);

    // https://stackoverflow.com/a/58049676/7712266
    return new Promise((resolve) => (this.speechSynthesisUtterance.onend = resolve));
  }

  /** 暂停朗读 */
  pause() {
    speechSynthesis.pause();
  }

  /** 恢复朗读（暂停之后恢复） */
  resume() {
    speechSynthesis.resume();
  }

  /** 取消朗读(清空话语队列) */
  cancel() {
    speechSynthesis.cancel();
  }

  /** 设置语音的语速 & 设置语音的高低音 */
  setPitchAndRate(config: { pitch: number; rate: number }) {
    return this.setPitch(config.pitch).setRate(config.rate);
  }

  /** 设置语音的语速(0.1-10)，默认值为 1  */
  setPitch(pitch: number) {
    this.pitch = pitch;
    return this;
  }

  /** 设置语音的高低音(0-2)，默认值为 0.8 */
  setRate(rate: number) {
    this.rate = rate;
    return this;
  }

  /** 初始化必要的内部参数 */
  private async init() {
    if (this.isReadyToSpeak) {
      return;
    }

    this.speechSynthesisUtterance = await this.buildSpeechSynthesisUtterance();
    this.isReadyToSpeak = true;
  }

  /** 生成语音请求：https://developer.mozilla.org/zh-CN/docs/Web/API/SpeechSynthesisUtterance */
  private async buildSpeechSynthesisUtterance() {
    const speechSynthesisUtterance = new SpeechSynthesisUtterance();

    speechSynthesisUtterance.rate = this.rate;
    speechSynthesisUtterance.pitch = this.pitch;
    speechSynthesisUtterance.voice = await this.getVoice();

    return speechSynthesisUtterance;
  }

  /** 异步获取系统语音（https://stackoverflow.com/a/52005323）：https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice */
  private getVoice() {
    return new Promise<SpeechSynthesisVoice>((resolve, reject) => {
      let id = setInterval(() => {
        const voices = speechSynthesis.getVoices();
        if (!voices.length) {
          return;
        }

        const voiceLang = 'zh-CN';
        const voiceName = 'Microsoft Kangkang - Chinese (Simplified, PRC)';
        const voice = voices.find((voice) => voice.lang === voiceLang && voice.name === voiceName);
        if (!voice) {
          return reject(`找不到 ${voiceName} 语音包`);
        }

        resolve(voice);
        clearInterval(id);
      }, 10);
    });
  }
}
