import React from 'react';
import './Amethyst.css';

const sections = [
    { id: 'altstore', label: '安裝 AltStore' },
    { id: 'dev-mode', label: '啟用開發者模式' },
    { id: 'amethyst', label: '安裝 Amethyst' },
    { id: 'localdevvpn', label: '安裝 LocalDevVPN' },
    { id: 'stikdebug', label: '安裝 StikDebug' },
    { id: 'idevicepair', label: '安裝 idevicepair' },
    { id: 'pairing-file', label: '設置 pairing file' },
    { id: 'launch', label: '開啟 Amethyst' },
];

export default function Amethyst() {
    return (
        <div className="amethyst-page">
            <article className="amethyst-container">
                <h1 className="amethyst-title">安裝 Amethyst（iOS 上的 Minecraft Java Launcher）</h1>

                <nav className="amethyst-toc">
                    <div className="amethyst-toc-label">目錄</div>
                    <ol>
                        {sections.map((s) => (
                            <li key={s.id}>
                                <a href={`#${s.id}`}>{s.label}</a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="amethyst-prep">
                    <h2>事前準備</h2>
                    <ul>
                        <li>一台筆電/電腦（Windows 或 Mac）</li>
                        <li>一條可傳輸資料的 USB 線（連接手機用）</li>
                    </ul>
                </div>

                <hr className="amethyst-divider" />

                <main className="amethyst-steps">
                    <h2 className="section-heading">具體步驟</h2>

                    {/* 步驟 1 */}
                    <section id="altstore" className="step-block">
                        <h3>1. 安裝 AltStore</h3>
                        <ol>
                            <li>
                                在電腦上安裝 iTunes 與 iCloud
                                <blockquote>
                                    <p>
                                        Windows 使用者請勿使用 Microsoft Store 版本，請至 Apple 官網下載獨立安裝包；
                                        Mac 使用者則無需安裝，使用內建 Finder 即可。
                                    </p>
                                </blockquote>
                            </li>
                            <li>
                                下載 AltServer（
                                <a
                                    href="https://cdn.altstore.io/file/altstore/altinstaller.zip"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    altinstaller.zip
                                </a>
                                ）
                            </li>
                            <li>安裝 AltServer 並開啟。</li>
                            <li>將手機連接至電腦，記得要點擊手機螢幕上的「信任電腦」提示。</li>
                            <li>
                                左鍵點擊圖示 AltServer
                                <div className="image-placeholder">
                                    {/*<img src={image1} alt="AltServer 圖示" />*/}
                                </div>
                            </li>
                            <li>
                                滑鼠移到 <code>Install AltStore</code> 並選擇你的裝置
                                <blockquote>
                                    <p>輸入 Apple ID 僅作為向 Apple 申請開發者簽名使用，若有疑慮可使用備用帳號。</p>
                                </blockquote>
                            </li>
                            <li>等電腦提示安裝完成。</li>
                            <li>前往手機「設定」&gt;「一般」&gt;「VPN 與裝置管理」。</li>
                            <li>點選並信任 AltStore 的開發者證書。</li>
                            <li>
                                AltStore 安裝完成
                                <blockquote>
                                    <p>免費 Apple ID 簽名有效期限為 7 天，過期前需連同電腦重新刷簽 Refresh Apps。</p>
                                </blockquote>
                            </li>
                        </ol>
                    </section>

                    {/* 步驟 2 */}
                    <section id="dev-mode" className="step-block">
                        <h3>2. 啟用開發者模式</h3>
                        <ol>
                            <li>前往「設定」&gt;「隱私權與安全性」&gt;「開發者模式」&gt; 開啟。</li>
                            <li>系統會要求重啟手機，重啟後請在彈出的視窗中點擊「開啟」並輸入手機解鎖密碼，開發者模式才算真正啟用。</li>
                        </ol>
                    </section>

                    {/* 步驟 3 */}
                    <section id="amethyst" className="step-block">
                        <h3>3. 安裝 Amethyst（Pojav Launcher iOS 版）</h3>
                        <ol>
                            <li>打開 AltStore 並在下方導覽列找到 <strong>News</strong>。</li>
                            <li>稍微往下滑找到 <strong>Angel Aura Amethyst</strong>。</li>
                            <li>點選即可安裝。</li>
                        </ol>
                    </section>

                    {/* 步驟 4 */}
                    <section id="localdevvpn" className="step-block">
                        <h3>4. 安裝 LocalDevVPN</h3>
                        <ol>
                            <li>打開 App Store 搜尋 <strong>LocalDevVPN</strong>。</li>
                            <li>安裝並打開。</li>
                            <li>同意該應用程式新增 VPN 設定檔。</li>
                        </ol>
                    </section>

                    {/* 步驟 5 */}
                    <section id="stikdebug" className="step-block">
                        <h3>5. 安裝 StikDebug</h3>
                        <ol>
                            <li>
                                在欲安裝 Amethyst 的裝置上下載 StikDebug 的 ipa（
                                <a
                                    href="https://github.com/StephenDev0/StikDebug/releases/download/3.1.9/StikDebug-3.1.9.ipa"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    StikDebug-3.1.9.ipa
                                </a>
                                ）
                            </li>
                            <li>存到一個你記得的地方（例如手機的「檔案」App）。</li>
                            <li>開啟 AltStore 並找到下方 <strong>My Apps</strong>。</li>
                            <li>確認沒有連接 VPN 且電腦有連接手機。</li>
                            <li>點選 <strong>+</strong> 號並選擇剛才下載的 StikDebug ipa。</li>
                            <li>StikDebug 安裝完成。</li>
                        </ol>
                    </section>

                    {/* 步驟 6 */}
                    <section id="idevicepair" className="step-block">
                        <h3>6. 安裝 idevicepair</h3>
                        <ol>
                            <li>
                                在電腦上下載 idevicepair（
                                <a
                                    href="https://github.com/jkcoxson/idevice_pair/releases/latest/download/idevice_pair--windows-x86_64.exe"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    idevice_pair--windows-x86_64.exe
                                </a>
                                ）
                            </li>
                            <li>打開 idevicepair。</li>
                            <li>確認 Wireless debugging, Developer mode, Developer image 都是綠色的。</li>
                            <li>
                                點選下方 <strong>Create</strong>
                                <blockquote>
                                    <p>
                                        這會在電腦上生成 pairingFile.plist，請將該檔案透過 AirDrop、iCloud Drive
                                        或傳訊軟體發送到手機上存檔。
                                    </p>
                                </blockquote>
                            </li>
                            <li>再次點選信任此電腦。</li>
                            <li>點選 <strong>StikDebug (Sideloaded)</strong>。</li>
                        </ol>
                    </section>

                    {/* 步驟 7 */}
                    <section id="pairing-file" className="step-block">
                        <h3>7. 設置 pairing file</h3>
                        <ol>
                            <li>手機上打開 StikDebug。</li>
                            <li>下方找到 <strong>Settings</strong>。</li>
                            <li>選擇 <strong>Import Pairing File</strong>。</li>
                            <li>
                                點選剛才傳到手機上的 <code>pairingFile.plist</code>
                                <div className="image-placeholder">
                                    {/* <img src={image2} alt="pairingFile 示意圖" /> */}
                                    ![pairingFile 設置圖]
                                </div>
                            </li>
                            <li>看到 <strong>Import successfully</strong> 代表成功。</li>
                        </ol>
                    </section>

                    {/* 步驟 8 */}
                    <section id="launch" className="step-block">
                        <h3>8. 開啟 Amethyst</h3>
                        <ol>
                            <li>打開 LocalDevVPN。</li>
                            <li>點選 <strong>Connect</strong>。</li>
                            <li>打開 StikDebug 選擇 Amethyst。</li>
                            <li>點選 <strong>Play</strong> 即可遊玩。</li>
                            <li>
                                若無法開啟，嘗試將 Renderer 設置為 <strong>Mobile Glues</strong> 且使用 1.21.11
                                （官方可能尚未修復 26.2 的支援）
                                <div className="image-placeholder">
                                    {/* <img src={image3} alt="Amethyst 畫面解說" /> */}
                                    ![Amethyst 畫面]
                                </div>
                            </li>
                        </ol>
                    </section>
                </main>
            </article>
        </div>
    );
}