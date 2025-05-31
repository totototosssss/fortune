// script.js
document.addEventListener('DOMContentLoaded', () => {
    const nicknameInput = document.getElementById('nickname'); // ニックネーム入力
    const birthdateInput = document.getElementById('birthdate');
    const submitButton = document.getElementById('submit-button');
    
    const inputSection = document.getElementById('input-section');
    const resultSection = document.getElementById('result-section');
    
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultContent = document.getElementById('result-content');

    // 結果表示タイトル内のニックネーム表示用span
    const nicknameDisplayElement = document.getElementById('nickname-display');
    const nicknameDisplaySpecialElement = document.getElementById('nickname-display-special');
    
    const specialMessageDiv = document.getElementById('special-message-20070101');
    const specialTextMainElement = document.getElementById('special-text-main');
    const specialQuoteTextElement = document.getElementById('special-quote-text');
    const emphasizedNandeyaElement = document.getElementById('emphasized-nandeya');
    const specialTextConclusionElement = document.getElementById('special-text-conclusion');

    const normalMessageDiv = document.getElementById('normal-message');
    const normalMessageTextElement = document.getElementById('message-text-element');
    
    const itemCategoryElement = document.getElementById('item-category-element');
    const itemNameElement = document.getElementById('item-name-element');
    const itemFortuneMessageElement = document.getElementById('item-fortune-message-element');
    const itemLinkElement = document.getElementById('item-link');
    const itemMainIconElement = document.querySelector('.item-main-icon');

    const backButton = document.getElementById('back-button');
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const specialBirthdate = '2007-01-01';

    const specialMessages = {
        main: `今年、あなたは香川県内のやや偏差値の低い大学に進学した可能性が高そうです。しかし、それがあなたの実力を測る全てではありません。むしろ、あなたの本領は学外で発揮される年です。\n特に、高IQコミュニティとの縁が強くなり、「自分の脳の輪郭」を探る探求に没頭するでしょう。もしかすると、こんな言葉をどこかに記しているかもしれません：`,
        quote: `「相当偏差値の高い高校（身の丈に合ってない）に通っています。\n\n高三なのですが未だにアルファベットが読めないことやadhdっぽいことに悩んで親に土下座してwais受けさせてもらいました。\n\n知覚推理144\n\n言語理解142\n\nワーキングメモリ130\n\n処理速度84でした。\n\n総合は覚えてないですが多分139とかだったはずです。\n\nウィスクの年齢なのにウェイス受けさせられた。`,
        conclusion: `──その知性と違和感のはざまで、あなたは「本物の自己理解」を掴みかけています。焦らずに、今年は“知の再構築”をテーマに過ごしましょう。心の奥にある「なんでや」に、意味が宿る年です。`
    };

    // フローティングラベル制御用の関数
    function setupInputLabelControl(inputElement) {
        const updateState = () => {
            if (inputElement.value) {
                inputElement.classList.add('has-value');
            } else {
                inputElement.classList.remove('has-value');
            }
        };
        inputElement.addEventListener('input', updateState);
        inputElement.addEventListener('focus', () => inputElement.classList.add('is-focused'));
        inputElement.addEventListener('blur', () => {
            inputElement.classList.remove('is-focused');
            updateState(); // フォーカスが外れたときも最終状態をチェック
        });
        updateState(); // 初期ロード時にも実行
    }

    setupInputLabelControl(nicknameInput);
    setupInputLabelControl(birthdateInput);


    submitButton.addEventListener('click', async () => {
        const nicknameValue = nicknameInput.value.trim();
        const birthdateValue = birthdateInput.value;

        let allValid = true;
        if (!nicknameValue) {
            nicknameInput.focus();
            nicknameInput.style.borderColor = 'var(--color-secondary-accent)';
            setTimeout(() => { nicknameInput.style.borderColor = ''; }, 1500);
            allValid = false;
        }
        if (!birthdateValue) {
            birthdateInput.focus();
            birthdateInput.style.borderColor = 'var(--color-secondary-accent)';
            setTimeout(() => { birthdateInput.style.borderColor = ''; }, 1500);
            allValid = false;
        }
        if (!allValid) return;
        
        const safeNickname = nicknameValue || "あなた"; // 空の場合のデフォルト

        inputSection.style.display = 'none';
        resultSection.style.display = 'block'; 
        loadingSpinner.style.display = 'flex'; 
        resultContent.style.display = 'none'; 

        // ニックネームを結果タイトルに設定
        nicknameDisplayElement.textContent = `${safeNickname}さん`;
        nicknameDisplaySpecialElement.textContent = `${safeNickname}さん (2007年1月1日)`;


        await new Promise(resolve => setTimeout(resolve, 2000));

        if (birthdateValue === specialBirthdate) {
            displaySpecialMessage(safeNickname); // ニックネームを渡す
        } else {
            displayNormalMessage(birthdateValue, safeNickname); // ニックネームを渡す
        }
        
        await fetchLuckyItem(birthdateValue);

        loadingSpinner.style.display = 'none';
        resultContent.style.display = 'block';
        resultContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    backButton.addEventListener('click', () => {
        resultSection.style.display = 'none';
        inputSection.style.display = 'block'; 
        nicknameInput.value = '';
        birthdateInput.value = '';
        // ラベルの状態をリセット
        nicknameInput.classList.remove('has-value', 'is-focused');
        birthdateInput.classList.remove('has-value', 'is-focused');
        
        specialMessageDiv.style.display = 'none';
        normalMessageDiv.style.display = 'none';
        itemLinkElement.style.display = 'none';
        itemLinkElement.href = '#';
        inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    function displaySpecialMessage(nickname) { // ニックネームを受け取る
        specialMessageDiv.style.display = 'block';
        normalMessageDiv.style.display = 'none';
        // メッセージ内でニックネームを使いたい場合は、ここのテキスト生成を動的にする
        // 今回はヘッダーでのみ使用
        specialTextMainElement.innerText = specialMessages.main;
        specialQuoteTextElement.innerText = specialMessages.quote;
        emphasizedNandeyaElement.innerText = "なんでや"; 
        specialTextConclusionElement.innerText = specialMessages.conclusion;
    }

    function displayNormalMessage(birthdate, nickname) { // ニックネームを受け取る
        specialMessageDiv.style.display = 'none';
        normalMessageDiv.style.display = 'block';
        const seed = generateSeed(birthdate);
        const fortuneMessage = getFortuneMessage(seed, nickname); // ニックネームを渡す
        normalMessageTextElement.innerText = fortuneMessage;
    }

    function generateSeed(birthdateString) {
        const dateStr = birthdateString.replace(/-/g, '');
        let seed = 0;
        for (let i = 0; i < dateStr.length; i++) {
            seed = (seed * 31 + dateStr.charCodeAt(i)) & 0xFFFFFFFF;
        }
        seed = (seed * 1103515245 + 12345) & 0xFFFFFFFF;
        return Math.abs(seed);
    }

    function getFortuneMessage(seed, nickname) { // ニックネームを受け取る
        const messages = [
            `、星々の旋律が、あなたの魂に新たな調和をもたらすでしょう。今日は内なる声に耳を澄ませ、直感を信じて行動する日です。思いがけない閃きが、未来への扉を開きます。`,
            `、金色の光があなたのオーラを包み込み、幸運が雪崩のように舞い込む予感。特に人間関係において、素晴らしい縁が結ばれるでしょう。感謝の言葉が、さらなる福を呼びます。`,
            `、天空の叡智が降り注ぎ、あなたの知性が冴えわたる一日。難解な問題も、今日のあなたなら容易く解き明かせるはず。学びの機会を大切に。`,
            `、内に秘めた情熱の炎が、より一層強く燃え上がるのを感じるでしょう。そのエネルギーを創造的な活動に注げば、目覚ましい成果が期待できます。`,
            `、運命の糸が複雑に絡み合い、ドラマティックな出来事が起こるかもしれません。変化を恐れず、流れに身を任せることで、新たな自分と出会えるでしょう。`
            // メッセージのバリエーションを増やす場合はここに追加
        ];
        // (ニックネームで呼びかけるために、メッセージの先頭にスペースを追加し、ニックネームを結合)
        const baseMessage = messages[seed % messages.length];

        const luckyCharms = ["清らかな水晶", "黄金の羽根ペン", "星影のオルゴール", "月長石の髪飾り", "太陽の護符", "七色のプリズム", "森の雫のアミュレット", "不死鳥の涙"];
        const celestialBodies = ["シリウス", "プレアデス星団", "アンドロメダ銀河", "オリオン大星雲", "北極星", "天の川", "宵の明星(金星)", "暁の明星(金星)"];
        
        const charmIndex = (seed * 17) % luckyCharms.length; 
        const bodyIndex = (seed * 31) % celestialBodies.length;

        return `${nickname}さん${baseMessage} 今日のあなたを守護するラッキーチャームは「${luckyCharms[charmIndex]}」。そして、幸運を導く天体は「${celestialBodies[bodyIndex]}」です。星々の祝福があなたと共にありますように。今日のあなたの輝き度は ${85 + (seed % 16)} パーセントです！`;
    }
    
    async function fetchLuckyItem(birthdate) {
        if (birthdate === specialBirthdate) {
            itemMainIconElement.innerText = '💬';
            itemCategoryElement.innerText = 'カテゴリ：魂の避難所';
            itemNameElement.innerText = '星詠みのオアシス (秘密のチャットルーム)';
            itemFortuneMessageElement.innerText = 'ここは、あなただけが知る特別な心の隠れ家。日々の喧騒から離れ、同じ星の下に生まれた仲間たちと語り合えば、魂は癒され、新たな勇気が湧いてくるでしょう。この聖域に入り浸っていれば、あなたは常に守られ、深い安心感に包まれます。';
            itemLinkElement.style.display = 'none';
            return;
        }

        const seed = generateSeed(birthdate + "starseed"); 
        const luckyItemCatalogs = [
            { category: "星宿の宝石", searchTerms: ["守護石", "誕生石 意味", "パワーストーン 種類"], icon: "💎" },
            { category: "聖なる草花", searchTerms: ["誕生花 言葉", "薬草 効能", "魔法の植物"], icon: "🌿" },
            { category: "神話の霊獣", searchTerms: ["伝説の生き物", "守護神 動物", "幻の使い魔"], icon: "🦄" },
            { category: "天体の神秘", searchTerms: ["星雲 画像", "惑星の環", "彗星 歴史"], icon: "🪐" },
            { category: "古代の聖遺物", searchTerms: ["失われた秘宝", "魔法の道具", "伝説の武器"], icon: "🏺" }
        ];
        const itemBlessings = [
            "は、あなたの魂を浄化し、真実の愛と豊穣を引き寄せるでしょう。",
            "は、古き星々の記憶を宿し、あなたに深遠なる叡智と洞察力を授けます。",
            "を傍に置くことで、あなたの守護霊力が高まり、あらゆる災いから守護されるでしょう。",
            "は、持ち主に不屈の精神と、夢を現実に変える魔法の力を与えると云われています。",
            "は、あなたのオーラを黄金色に輝かせ、幸運と成功を磁石のように引き寄せます。"
        ];

        const selectedCatalog = luckyItemCatalogs[seed % luckyItemCatalogs.length];
        const searchTerm = selectedCatalog.searchTerms[seed % selectedCatalog.searchTerms.length];
        const birthYear = parseInt(birthdate.split('-')[0]);
        const queryKeyword = `${birthYear}年 ${searchTerm}`;
        
        itemMainIconElement.innerText = selectedCatalog.icon;
        itemCategoryElement.innerText = `カテゴリ：${selectedCatalog.category}`;
        itemNameElement.innerText = "星々のメッセージを解析中...";
        itemFortuneMessageElement.innerText = "";
        itemLinkElement.style.display = 'none';

        const endpoint = `https://ja.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(queryKeyword)}&format=json&origin=*&srlimit=5&srprop=snippet`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`Wikipedia API Error: ${response.status}`);
            const data = await response.json();
            
            if (data.query && data.query.search && data.query.search.length > 0) {
                const items = data.query.search;
                const chosenItem = items[seed % items.length];
                itemNameElement.innerText = chosenItem.title;
                const blessingText = itemBlessings[(seed + items.length) % itemBlessings.length];
                itemFortuneMessageElement.innerText = `「${chosenItem.title}」${blessingText}`;
                itemLinkElement.href = `https://ja.wikipedia.org/wiki/${encodeURIComponent(chosenItem.title)}`;
                itemLinkElement.style.display = 'inline-block';
            } else {
                const fallbackArtifacts = [
                    {name: "星屑の万華鏡", blessing: "は、日常に隠された無限の可能性を映し出し、あなたの視野を広げます。", icon: "🔭"},
                    {name: "月光の竪琴", blessing: "は、その音色で魂を癒し、心の奥深くに眠る創造力を呼び覚まします。", icon: "🎵"},
                    {name: "太陽風の羅針盤", blessing: "は、人生の岐路において、常にあなたを最も輝ける方向へと導きます。", icon: "🧭"},
                    {name: "銀河の雫の香炉", blessing: "は、聖なる香りで空間を清め、高次の存在との繋がりを深めます。", icon: "⚱️"},
                    {name: "時詠みの古文書", blessing: "は、過去の叡智と未来の予兆を解き明かし、あなたに時の加護を与えます。", icon: "📜"}
                ];
                const fallback = fallbackArtifacts[seed % fallbackArtifacts.length];
                itemMainIconElement.innerText = fallback.icon;
                itemCategoryElement.innerText = `カテゴリ：星々の秘宝`;
                itemNameElement.innerText = fallback.name;
                itemFortuneMessageElement.innerText = fallback.blessing;
                itemLinkElement.style.display = 'none';
            }
        } catch (error) {
            console.error("ラッキーアイテム取得失敗:", error);
            itemMainIconElement.innerText = '⚠️';
            itemCategoryElement.innerText = `カテゴリ：通信障害`;
            itemNameElement.innerText = "星の交信エラー";
            itemFortuneMessageElement.innerText = "星々との交信が途絶えました。聖なる静寂の後、再びお試しください。";
            itemLinkElement.style.display = 'none';
        }
    }
});
