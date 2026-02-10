function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* COMPANY 섹션 */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-8">
            Company
          </p>
          
          <h2 className="text-xl tracking-[0.2em] text-black mb-16">
            SIMKIMYUNHONGSUNG
          </h2>

          {/* 서비스 설명 */}
          <div className="space-y-8 text-[13px] leading-relaxed text-gray-600">
            <p>
              본 서비스는 사용자 보유 의류 데이터와 자체 쇼핑몰 상품 데이터를 기반으로
              <br />
              사용자의 요구에 맞는 착장을 추천하는 AI 기반 코디 추천 서비스입니다.
            </p>

            <p>
              이 서비스는 자연어 이해(NLP)와 이미지 임베딩 기반 멀티모달 AI 모델을 결합해 동작합니다.
              <br />
              사용자의 텍스트 요청과 보유 의류, 상품 이미지, 코디 데이터는 이미지를 벡터(임베딩)하여 스타일을
              <br />
              계산하고, 가장 어울리는 착장 상품을 추천합니다.
            </p>

            <p className="text-black font-medium pt-8">
              CloZ와 함께, 갖고 계신 옷을 가장 잘 입어보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
