/* Flow Play — Rock, Paper, Scissors. Game logic, keyboard shortcuts, match settings and saved stats. */
const bestOfSelect=document.querySelector('#bestOf');
const modeSelect=document.querySelector('#mode');
const playerScoreEl=document.querySelector('#playerScore');
const computerScoreEl=document.querySelector('#computerScore');
const drawScoreEl=document.querySelector('#drawScore');
const roundInfoEl=document.querySelector('#roundInfo');
const playerHand=document.querySelector('#playerHand');
const computerHand=document.querySelector('#computerHand');
const messageEl=document.querySelector('#message');
const choiceButtons=document.querySelectorAll('.choice');
const newMatchBtn=document.querySelector('#newMatchBtn');
const historyList=document.querySelector('#historyList');
const statsEl=document.querySelector('#stats');
const playerCaption=document.querySelector('#playerCaption');
const computerCaption=document.querySelector('#computerCaption');
const drawsSummary=document.querySelector('#drawsSummary');
const CHOICES=['rock','paper','scissors'];
const ICONS={rock:'🪨',paper:'📄',scissors:'✂️'};
const NAMES={rock:'Rock',paper:'Paper',scissors:'Scissors'};
const BEATS={rock:'scissors',paper:'rock',scissors:'paper'};
let state=createFreshState();
let stats=loadStats();
function createFreshState(){return {playerScore:0,computerScore:0,draws:0,round:1,streak:0,locked:false,matchOver:false,history:[],moveCount:{rock:0,paper:0,scissors:0}}}
function getWinsNeeded(){return Math.ceil(Number(bestOfSelect.value)/2)}
function randomChoice(){return CHOICES[Math.floor(Math.random()*CHOICES.length)]}
function smartChoice(){let favorite=null,highest=0;for(const move of CHOICES){if(state.moveCount[move]>highest){highest=state.moveCount[move];favorite=move}}if(favorite&&Math.random()<.6)return CHOICES.find(move=>BEATS[move]===favorite);return randomChoice()}
function getComputerChoice(){return modeSelect.value==='smart'?smartChoice():randomChoice()}
function getResult(player,computer){if(player===computer)return'draw';if(BEATS[player]===computer)return'win';return'lose'}
function setButtonsDisabled(disabled){choiceButtons.forEach(button=>button.disabled=disabled||state.matchOver)}
function play(choice){if(state.locked||state.matchOver)return;state.locked=true;setButtonsDisabled(true);const computerChoice=getComputerChoice();state.moveCount[choice]++;playerHand.className='character hand shake';computerHand.className='character flip hand shake';playerHand.textContent='✊';computerHand.textContent='✊';playerCaption.textContent='Choosing...';computerCaption.textContent='Choosing...';const words=['Rock…','Paper…','Scissors…'];words.forEach((word,i)=>setTimeout(()=>{messageEl.textContent=word},i*380));setTimeout(()=>revealRound(choice,computerChoice),words.length*380)}
function revealRound(player,computer){const result=getResult(player,computer);playerHand.className='character hand'+(result==='win'?' win':result==='lose'?' lose':'');computerHand.className='character flip hand'+(result==='lose'?' win':result==='win'?' lose':'');playerHand.textContent=ICONS[player];computerHand.textContent=ICONS[computer];playerCaption.textContent=NAMES[player];computerCaption.textContent=NAMES[computer];if(result==='win'){state.playerScore++;state.streak++;stats.wins++;messageEl.textContent='You won this round! ✨'}else if(result==='lose'){state.computerScore++;state.streak=0;stats.losses++;messageEl.textContent='The computer takes this round.'}else{state.draws++;state.streak=0;stats.draws++;messageEl.textContent='A draw! Great minds think alike.'}state.history.unshift({player,computer,result,round:state.round});if(state.history.length>8)state.history.pop();state.round++;state.locked=false;updateUI();saveStats();if(state.playerScore>=getWinsNeeded()||state.computerScore>=getWinsNeeded()){state.matchOver=true;messageEl.textContent=state.playerScore>state.computerScore?'You won the match! 🎉':'Match complete — try again!';setButtonsDisabled(true);newMatchBtn.classList.add('attention')}else{setButtonsDisabled(false)}}
function updateUI(){playerScoreEl.textContent=state.playerScore;computerScoreEl.textContent=state.computerScore;drawScoreEl.textContent=state.draws;drawsSummary.textContent=state.draws;roundInfoEl.textContent=state.matchOver?'MATCH COMPLETE':`ROUND ${state.round} · BEST OF ${bestOfSelect.value}`;historyList.innerHTML='';if(!state.history.length){historyList.innerHTML='<li class="empty-history">Your rounds will appear here.</li>'}else{state.history.forEach(item=>{const li=document.createElement('li');const resultLabel=item.result==='win'?'You won':item.result==='lose'?'You lost':'Draw';li.innerHTML=`<span class="history-emoji">${ICONS[item.player]}</span><span><span class="history-result ${item.result}">${resultLabel}</span><br><span class="history-time">Round ${item.round} · You ${NAMES[item.player]} / CPU ${NAMES[item.computer]}</span></span><span class="history-emoji">${ICONS[item.computer]}</span>`;historyList.appendChild(li)})}statsEl.textContent=`Lifetime · ${stats.wins} wins · ${stats.losses} losses · ${stats.draws} draws`}
function newMatch(){state=createFreshState();playerHand.className='character';computerHand.className='character flip';playerHand.textContent='✊';computerHand.textContent='✊';playerCaption.textContent='Your move';computerCaption.textContent='Waiting...';messageEl.textContent='Pick your character to begin';newMatchBtn.classList.remove('attention');setButtonsDisabled(false);updateUI()}
function loadStats(){try{return JSON.parse(localStorage.getItem('flowRpsStats'))||{wins:0,losses:0,draws:0}}catch{return{wins:0,losses:0,draws:0}}}
function saveStats(){localStorage.setItem('flowRpsStats',JSON.stringify(stats))}
choiceButtons.forEach(button=>button.addEventListener('click',()=>play(button.dataset.choice)));
newMatchBtn.addEventListener('click',newMatch);
bestOfSelect.addEventListener('change',newMatch);
modeSelect.addEventListener('change',()=>{messageEl.textContent=modeSelect.value==='smart'?'Smart opponent is ready. Good luck!':'Random opponent is ready. Good luck!' });
document.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey)return;const key=event.key.toLowerCase();const map={r:'rock',p:'paper',s:'scissors'};if(map[key])play(map[key]);if(key==='n')newMatch()});
updateUI();
