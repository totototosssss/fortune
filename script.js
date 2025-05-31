// script.js
document.addEventListener('DOMContentLoaded', () => {
    const birthdateInput = document.getElementById('birthdate');
    const submitButton = document.getElementById('submit-button');
    const resultArea = document.getElementById('result-area');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultContent = document.getElementById('result-content');
    
    const specialMessageDiv = document.getElementById('special-message-20070101');
    const specialTextMainElement = document.getElementById('special-text-main');
    const specialQuoteTextElement = document.getElementById('special-quote-text');
    const emphasizedNandeyaElement = document.getElementById('emphasized-nandeya'); // これは元々ID指定済み
    const specialTextConclusionElement = document.getElementById('special-text-conclusion');

    const normalMessageDiv = document.getElementById('normal-message');
    const normalMessageTextElement = document.getElementById('message-text-element');
    
    const itemNameElement = document.getElementById('item-name-element');
    const itemDescriptionElement = document.getElementById('item-description-element');
    const itemLinkElement = document.getElementById('item-link');

    const backButton = document.getElementById('back-button');
    const inputArea = document.getElementById('input-area');
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const specialBirthdate = '2007-01-01';

    // 2007/1/1の特別メッセージのテキスト
    const specialMessages = {
        main: `今年、あなたは香川県内のやや偏差値の低い大学に進学した可能性が高そうです。しかし、それがあなたの実力を測る全てではありません。むしろ、あなたの本領は学外で発揮される年です。\n特に、高IQコミュニティとの縁が強くなり、「自分の脳の輪郭」を探る探求に没頭するでしょう。もしかすると、こんな言葉をどこかに記しているかもしれません：`,
        quote: `「相当偏差値の高い高校（身の丈に合ってない）に通っています。\n\n高三なのですが未だにアルファベットが読めないことやadhdっぽいことに悩んで親に土下座してwais受けさせてもらいました。\n\n知覚推理144\n\n言語理解142\n\nワーキングメモリ130\n\n処理速度84でした。\n\n総合は覚えてないですが多分139とかだったはずです。\n\nウィスクの年齢なのにウェイス受けさせられた。`, // 「なんでや」は別要素
        conclusion: `──その知性と違和感のはざまで、あなたは「本物の自己理解」を掴みかけています。焦らずに、今年は“知の再構築”をテーマに過ごしましょう。心の奥にある「なんでや」に、意味が宿る年です。`
    };


    submitButton.addEventListener('click', async () => {
        const birthdateValue = birthdateInput.value;
        if (!birthdateValue) {
            alert('生年月日を入力してください。');
            return;
        }

        inputArea.style.display = 'none';
        resultArea.style.display = 'block';
        loadingSpinner.style.display = 'block';
        resultContent.style.display = 'none'; // 結果はロード後に表示

        // 意図的に少し待機してローディングを見せる（API呼び出しの代わり）
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        if (birthdateValue === specialBirthdate) {
            displaySpecialMessage();
        } else {
            displayNormalMessage(birthdateValue);
        }
        
        await fetchRecommendedItem(birthdateValue);

        loadingSpinner.style.display = 'none';
        resultContent.style.display = 'block';
    });

    backButton.addEventListener('click', () => {
        resultArea.style.display = 'none';
        inputArea.style.display = 'block';
        birthdateInput.value = ''; // 入力値をクリア
        // 表示内容をリセット
        specialMessageDiv.style.display = 'none';
        normalMessageDiv.style.display = 'none';
        itemLinkElement.style.display = 'none';
        itemLinkElement.href = '#';
    });

    function displaySpecialMessage() {
        specialMessageDiv.style.display = 'block';
        normalMessageDiv.style.display = 'none';

        specialTextMainElement.innerText = specialMessages.main;
        specialQuoteTextElement.innerText = specialMessages.quote;
        // emphasizedNandeyaElement のテキストはHTMLで固定されているが、念のため設定
        emphasizedNandeyaElement.innerText = "なんでや"; 
        specialTextConclusionElement.innerText = specialMessages.conclusion;
    }

    function displayNormalMessage(birthdate) {
        specialMessageDiv.style.display = 'none';
        normalMessageDiv.style.display = 'block';
        
        const seed = generateSeed(birthdate);
        const fortuneMessage = getFortuneMessage(seed);
        normalMessageTextElement.innerText = fortuneMessage;
    }

    function generateSeed(birthdate) {
        // YYYY-MM-DD 形式から数字部分だけを取り出して数値化
        const dateParts = birthdate.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);
        
        // 簡単なシード生成ロジック（より複雑なハッシュ関数も可）
        // 生年月日が異なればほぼ異なる値になるようにする
        let seed = (year * 10000) + (month * 100) + day;
        seed = (seed * 9301 + 49297) % 233280; // 簡易的な線形合同法
        return seed;
    }

    function getFortuneMessage(seed) {
        const messages = [
            "今日は新しい発見がありそうな一日。小さな変化も見逃さないで。",
            "笑顔を心がけると、幸運が舞い込んでくるでしょう。特に午前中がカギ。",
            "意外な人からの助けがありそう。感謝の気持ちを忘れずに。",
            "集中力が高まる日。難しいと思っていたことにも挑戦してみて。",
            "リラックスがテーマの日。好きな音楽を聴いたり、自然に触れたりするのが吉。",
            "創造的なアイデアが湧きやすい時。メモを取る習慣を。",
            "コミュニケーションが円滑に進む日。積極的に話しかけてみましょう。",
            "過去の努力が実を結ぶ兆し。諦めずにもう一歩。",
            "新しい趣味や学びを始めると良い時期。あなたの世界が広がります。",
            "感謝の気持ちを伝えることで、人間関係がより豊かになります。"
        ];
        const adjectives = ["素晴らしい", "驚くべき", "楽しい", "穏やかな", "刺激的な", "実りある", "輝かしい", "心温まる"];
        const actions = ["挑戦する", "楽しむ", "学ぶ", "分かち合う", "感謝する", "計画する", "リフレッシュする", "感動する"];

        const msgIndex = seed % messages.length;
        const adjIndex = (seed + 1) % adjectives.length;
        const actIndex = (seed + 2) % actions.length;

        return `${messages[msgIndex]} 今日は${adjectives[adjIndex]}出来事がありそうなので、積極的に${actions[actIndex]}と良いでしょう！あなたのラッキーナンバーは ${seed % 100} です。`;
    }

    async function fetchRecommendedItem(birthdate) {
        const seed = generateSeed(birthdate + "item"); // アイテム用に少しシードをずらす
        const keywords = [
            "日本の伝統工芸品", "世界の美しい風景", "珍しい動植物", 
            "歴史的建造物", "宇宙の謎", "深海生物", 
            "発明品", "古典文学", "未来技術", "縁起物"
        ];
        const selectedKeyword = keywords[seed % keywords.length];
        
        const endpoint = `https://ja.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(selectedKeyword)}&format=json&origin=*&srlimit=5&srprop=snippet`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`Wikipedia APIエラー: ${response.status}`);
            }
            const data = await response.json();
            
            if (data.query && data.query.search && data.query.search.length > 0) {
                const items = data.query.search;
                const chosenItem = items[seed % items.length]; // 取得結果からランダムに選ぶ
                
                itemNameElement.innerText = chosenItem.title;
                // snippetにはHTMLタグが含まれることがあるので、テキストとして扱うか、安全に表示する必要がある
                // ここでは簡易的にテキストとして表示
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = chosenItem.snippet;
                itemDescriptionElement.innerText = tempDiv.textContent || tempDiv.innerText || "";
                
                itemLinkElement.href = `https://ja.wikipedia.org/wiki/${encodeURIComponent(chosenItem.title)}`;
                itemLinkElement.style.display = 'inline-block';

            } else {
                itemNameElement.innerText = "情報が見つかりませんでした";
                itemDescriptionElement.innerText = `「${selectedKeyword}」に関する情報が見つかりませんでした。`;
                itemLinkElement.style.display = 'none';
            }
        } catch (error) {
            console.error("おすすめアイテムの取得に失敗:", error);
            itemNameElement.innerText = "取得エラー";
            itemDescriptionElement.innerText = "情報の取得中に問題が発生しました。もう一度お試しください。";
            itemLinkElement.style.display = 'none';
        }
    }
});
